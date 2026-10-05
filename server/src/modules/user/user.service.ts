import { env } from '../../config/env.js';
import { userRepository } from './user.repository.js';
import { IUserDocument, IUser, ILeaderboardResponse, ILeaderboardEntry, IPublicUserProfile } from './user.types.js';
import { AppError } from '../../shared/errors/api-error.js';

import { UserModel } from './user.model.js';
import { Types } from 'mongoose';
import { BattleModel } from '../battle/battle.model.js';
import { BattleStatus } from '../battle/battle.types.js';

export class UserService {
  async getOrCreateUser(clerkId: string): Promise<IUserDocument> {
    if (Types.ObjectId.isValid(clerkId)) {
      const byId = await UserModel.findById(clerkId);
      if (byId) return byId;
    }

    let user = await userRepository.findByClerkId(clerkId);
    if (user) {
      return user;
    }

    try {
      const username = `user_${clerkId.slice(-8)}`;
      const displayName = `User ${clerkId.slice(-4)}`;
      const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;

      user = await userRepository.create({
        clerkId,
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
        const existingUser = await userRepository.findByClerkId(clerkId);
        if (existingUser) {
          return existingUser;
        }
      }
      throw error;
    }
  }

  async getUserByClerkId(clerkId: string): Promise<IUserDocument> {
    const user = await userRepository.findByClerkId(clerkId);
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

  async updateUserProfile(userIdOrClerkId: string, updateData: Partial<IUser>): Promise<IUserDocument> {
    // Only allow updating specific non-statistic profile fields
    const allowedUpdates: Partial<IUser> = {};
    if (updateData.displayName !== undefined) allowedUpdates.displayName = updateData.displayName;
    if (updateData.avatar !== undefined) allowedUpdates.avatar = updateData.avatar;

    let user: IUserDocument | null = null;
    if (Types.ObjectId.isValid(userIdOrClerkId)) {
      user = await UserModel.findByIdAndUpdate(userIdOrClerkId, allowedUpdates, { new: true });
    }
    if (!user) {
      user = await userRepository.updateByClerkId(userIdOrClerkId, allowedUpdates);
    }
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

    const higherRankCount = await UserModel.countDocuments({
      isGuest: { $ne: true },
      $or: [
        { wins: { $gt: wins } },
        { wins, accuracy: { $gt: accuracy } },
        { wins, accuracy, matchesPlayed: { $gt: matchesPlayed } },
        { wins, accuracy, matchesPlayed, username: { $lt: username } },
      ],
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

    const filter = { isGuest: { $ne: true } };

    // Parallel count and indexed projection query
    const [total, users] = await Promise.all([
      UserModel.countDocuments(filter),
      UserModel.find(filter)
        .sort({ wins: -1, accuracy: -1, matchesPlayed: -1, username: 1 })
        .skip(skip)
        .limit(limit)
        .select('_id username displayName avatar wins losses draws matchesPlayed totalCorrect totalQuestions accuracy')
        .lean()
        .exec(),
    ]);

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
        const currentUserDoc = await UserModel.findById(currentUserId).lean();
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
    const recentBattlesPromise = BattleModel.find({
      'players.userId': user._id,
      status: BattleStatus.COMPLETED,
    })
      .sort({ endedAt: -1, startedAt: -1 })
      .limit(10)
      .populate('players.userId', 'username displayName avatar')
      .populate('winnerId', 'username displayName avatar')
      .lean()
      .exec();

    const [rank, userBattles] = await Promise.all([rankPromise, recentBattlesPromise]);

    // Format recent completed battles
    const recentBattles = userBattles.map((b: any) => {
      const myP = b.players.find((p: any) => {
        const pUId = p?.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() : p?.userId?.toString();
        return pUId === uIdStr;
      }) || b.players[0];

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

      const winnerIdStr = b.winnerId
        ? (b.winnerId as any)._id
          ? (b.winnerId as any)._id.toString()
          : b.winnerId.toString()
        : null;

      let result: 'VICTORY' | 'DEFEAT' | 'DRAW' = 'DRAW';
      if (b.isDraw) {
        result = 'DRAW';
      } else if (winnerIdStr === uIdStr) {
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
        userScore: myP?.score || 0,
        opponentScore: oppP?.score || 0,
        result,
        opponent: oppUser,
      };
    });

    return {
      userId: uIdStr,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar || '',
      joinedAt: user.createdAt,
      rank,
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
