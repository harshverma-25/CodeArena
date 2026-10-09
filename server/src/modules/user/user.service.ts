import { env } from '../../config/env.js';
import { userRepository } from './user.repository.js';
import { IUserDocument, IUser, ILeaderboardResponse, ILeaderboardEntry, IPublicUserProfile } from './user.types.js';
import { AppError } from '../../shared/errors/api-error.js';

import { Types } from 'mongoose';
import { battleRepository } from '../battle/battle.repository.js';
import { BattleStatus } from '../battle/battle.types.js';

export class UserService {
  async getOrCreateUser(identifier: string): Promise<IUserDocument> {
    if (Types.ObjectId.isValid(identifier)) {
      const byId = await userRepository.findById(identifier);
      if (byId) return byId;
    }

    const username = identifier.startsWith('user_') ? identifier : `user_${identifier.slice(-8)}`;
    let user = await userRepository.findByUsername(username);
    if (user) {
      return user;
    }

    try {
      const displayName = `User ${identifier.slice(-4)}`;
      const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;

      user = await userRepository.create({
        username,
        displayName,
        avatar,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        accuracy: 0,
        highestWinStreak: 0,
      });

      return user;
    } catch (error: any) {
      if (error.code === 11000 || error.message?.includes('E11000')) {
        const existingUser = await userRepository.findByUsername(username);
        if (existingUser) {
          return existingUser;
        }
      }
      throw error;
    }
  }

  async getUserById(userId: string): Promise<IUserDocument> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async getUserByUsername(username: string): Promise<IUserDocument> {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateUserProfile(userId: string, updateData: Partial<IUser>): Promise<IUserDocument> {
    // Only allow updating specific non-statistic profile fields
    const allowedUpdates: Partial<IUser> = {};
    if (updateData.displayName !== undefined) allowedUpdates.displayName = updateData.displayName;
    if (updateData.avatar !== undefined) allowedUpdates.avatar = updateData.avatar;

    const user = await userRepository.updateById(userId, allowedUpdates);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  /**
   * Efficiently calculate a user's 1-indexed global rank using MongoDB countDocuments.
   * Tie-breaking: wins DESC, accuracy DESC, matchesPlayed DESC, username ASC.
   */
  async calculateUserRank(user: {
    wins?: number;
    accuracy?: number;
    matchesPlayed?: number;
    username: string;
    isGuest?: boolean;
  }): Promise<number> {
    if (user.isGuest) return 0;

    const wins = user.wins || 0;
    const accuracy = user.accuracy || 0;
    const matchesPlayed = user.matchesPlayed || 0;
    const username = user.username;

    const higherRankCount = await userRepository.countHigherRankedUsers({
      wins,
      accuracy,
      matchesPlayed,
      username,
    });

    return higherRankCount + 1;
  }

  /**
   * Optimized global leaderboard with MongoDB pagination, projection, and indexed sorting.
   */
  async getLeaderboard(
    options: { page?: number; limit?: number },
    currentUserId?: string
  ): Promise<ILeaderboardResponse> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));
    const skip = (page - 1) * limit;

    // Parallel count and indexed projection query via repository
    const { total, users } = await userRepository.findLeaderboard({ skip, limit });

    const leaderboard: ILeaderboardEntry[] = users.map((u, index) => {
      const uIdStr = u._id.toString();
      return {
        rank: skip + index + 1,
        userId: uIdStr,
        username: u.username,
        displayName: u.displayName,
        avatar: u.avatar || '',
        wins: u.wins || 0,
        losses: u.losses || 0,
        draws: u.draws || 0,
        battlesPlayed: u.matchesPlayed || 0,
        totalCorrect: u.totalCorrect || 0,
        totalQuestions: u.totalQuestions || 0,
        accuracy: u.accuracy || 0,
        isCurrentUser: currentUserId ? uIdStr === currentUserId : false,
      };
    });

    // Efficiently resolve currentUserRank
    let currentUserRank: ILeaderboardEntry | null = null;
    if (currentUserId) {
      const inPageEntry = leaderboard.find((entry) => entry.userId === currentUserId);
      if (inPageEntry) {
        currentUserRank = inPageEntry;
      } else {
        const currentUserDoc = await userRepository.findById(currentUserId);
        if (currentUserDoc && !currentUserDoc.isGuest) {
          const rank = await this.calculateUserRank(currentUserDoc);
          currentUserRank = {
            rank,
            userId: currentUserId,
            username: currentUserDoc.username,
            displayName: currentUserDoc.displayName,
            avatar: currentUserDoc.avatar || '',
            wins: currentUserDoc.wins || 0,
            losses: currentUserDoc.losses || 0,
            draws: currentUserDoc.draws || 0,
            battlesPlayed: currentUserDoc.matchesPlayed || 0,
            totalCorrect: currentUserDoc.totalCorrect || 0,
            totalQuestions: currentUserDoc.totalQuestions || 0,
            accuracy: currentUserDoc.accuracy || 0,
            isCurrentUser: true,
          };
        }
      }
    }

    return {
      leaderboard,
      total,
      page,
      limit,
      currentUserRank,
    };
  }

  /**
   * Get public profile and completed battle stats for a user by username.
   * Uses persistent counters, database rank calculation, and loads only the recent 10 battles.
   */
  async getUserProfileByUsername(username: string, currentUserId?: string): Promise<IPublicUserProfile> {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new AppError(`User '${username}' not found`, 404);
    }

    const uIdStr = user._id.toString();

    // 1. Calculate global rank efficiently without loading leaderboard
    const rankPromise = this.calculateUserRank(user);

    // 2. Fetch only the 10 most recent completed battles for this user (indexed query)
    const recentBattlesPromise = battleRepository.findRecentCompletedByUserId(user._id, 10);

    const [rank, userBattles] = await Promise.all([rankPromise, recentBattlesPromise]);

    let totalScore = 0;
    let bestScore = 0;
    let bestRank = user.wins > 0 ? 1 : 0;

    // Format recent completed battles with multiplayer ranking awareness
    const recentBattles = userBattles.map((b: any) => {
      const sorted = [...b.players].sort((p1: any, p2: any) => (p2.score || 0) - (p1.score || 0));
      let currentRank = 1;
      const playerRankings = sorted.map((p: any, idx: number) => {
        if (idx > 0 && (p.score || 0) < (sorted[idx - 1].score || 0)) {
          currentRank = idx + 1;
        }
        const pUId = p?.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() : p?.userId?.toString() || '';
        const userObj = p?.userId && typeof p.userId === 'object' ? p.userId : null;
        return {
          userId: pUId,
          username: userObj?.username || '',
          displayName: userObj?.displayName || userObj?.username || 'Player',
          avatar: userObj?.avatar || '',
          score: p.score || 0,
          rank: currentRank,
        };
      });

      const myRankEntry = playerRankings.find((r) => r.userId === uIdStr) || playerRankings[0];
      const myP = b.players.find((p: any) => {
        const pUId = p?.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() : p?.userId?.toString();
        return pUId === uIdStr;
      }) || b.players[0];

      const userRank = myRankEntry ? myRankEntry.rank : 1;
      const userScore = myP?.score || 0;
      const totalPlayers = b.players.length;

      totalScore += userScore;
      if (userScore > bestScore) bestScore = userScore;
      if (bestRank === 0 || userRank < bestRank) bestRank = userRank;

      const pAnswers = myP?.answers || [];
      const pCorrect = pAnswers.filter((ans: any) => ans.isCorrect).length;
      const pTotal = myP?.assignedQuestionIds?.length || b.questionCount || 10;
      const userAccuracy = pTotal > 0 ? Math.round((pCorrect / pTotal) * 100) : 0;

      const oppP = b.players.find((p: any) => {
        const pUId = p?.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() : p?.userId?.toString();
        return pUId !== uIdStr;
      }) || null;

      const oppUser = oppP?.userId && typeof oppP.userId === 'object'
        ? {
            userId: (oppP.userId as any)._id ? (oppP.userId as any)._id.toString() : oppP.userId.toString(),
            username: (oppP.userId as any).username || '',
            displayName: (oppP.userId as any).displayName || '',
            avatar: (oppP.userId as any).avatar || '',
          }
        : null;

      let result: 'VICTORY' | 'DEFEAT' | 'DRAW' | 'COMPLETED' = 'COMPLETED';
      if (totalPlayers === 1) {
        result = 'COMPLETED';
      } else if (b.isDraw) {
        result = 'DRAW';
      } else if (userRank === 1) {
        result = 'VICTORY';
      } else {
        result = 'DEFEAT';
      }

      const startedMs = b.startedAt ? new Date(b.startedAt).getTime() : 0;
      const endedMs = b.endedAt ? new Date(b.endedAt).getTime() : Date.now();
      const duration = startedMs > 0 ? Math.max(0, Math.floor((endedMs - startedMs) / 1000)) : 0;

      return {
        _id: b._id.toString(),
        roomCode: b.roomCode,
        topic: b.topic,
        difficulty: b.difficulty,
        questionCount: b.questionCount,
        startedAt: b.startedAt,
        endedAt: b.endedAt,
        duration,
        userRank,
        totalPlayers,
        userAccuracy,
        userScore,
        opponentScore: oppP?.score || 0,
        result,
        opponent: oppUser,
        players: playerRankings,
      };
    });

    const avgScore = userBattles.length > 0 ? Math.round(totalScore / userBattles.length) : 0;
    if (user.wins > 0) bestRank = 1;
    if (bestRank === 0 && (user.matchesPlayed || 0) > 0) bestRank = 1;

    return {
      userId: uIdStr,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar || '',
      joinedAt: user.createdAt,
      rank,
      quizzesPlayed: user.matchesPlayed || userBattles.length,
      avgScore,
      bestScore,
      bestRank: bestRank || 1,
      battlesPlayed: user.matchesPlayed || 0,
      wins: user.wins || 0,
      losses: user.losses || 0,
      draws: user.draws || 0,
      totalCorrect: user.totalCorrect || 0,
      totalQuestions: user.totalQuestions || 0,
      accuracy: user.accuracy || 0,
      isCurrentUser: currentUserId ? uIdStr === currentUserId : false,
      recentBattles,
    };
  }
}

export const userService = new UserService();
export default userService;
