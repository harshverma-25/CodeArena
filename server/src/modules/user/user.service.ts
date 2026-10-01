import { clerkClient } from '../../config/clerk.js';
import { userRepository } from './user.repository.js';
import { IUserDocument, IUser, ILeaderboardResponse, ILeaderboardEntry, IPublicUserProfile } from './user.types.js';
import { AppError } from '../../utils/app-error.js';
import { UserModel } from './user.model.js';
import { BattleModel } from '../battle/battle.model.js';
import { BattleStatus } from '../battle/battle.types.js';

export class UserService {
  async getOrCreateUser(clerkId: string): Promise<IUserDocument> {
    let user = await userRepository.findByClerkId(clerkId);
    if (user) {
      return user;
    }

    try {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      
      const username = clerkUser.username || `user_${clerkId.slice(-6)}`;
      const displayName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || username;
      const avatar = clerkUser.imageUrl || '';

      user = await userRepository.create({
        clerkId,
        username,
        displayName,
        avatar,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        totalSubmissions: 0,
        acceptedSubmissions: 0,
        highestWinStreak: 0,
        preferredLanguage: 'javascript',
      });

      return user;
    } catch (error: any) {
      // Check for MongoDB E11000 duplicate key error code or error message suffix
      if (error.code === 11000 || error.message?.includes('E11000')) {
        const existingUser = await userRepository.findByClerkId(clerkId);
        if (existingUser) {
          return existingUser;
        }
      }
      // Fallback for mock test users not found in Clerk Cloud
      if (clerkId.startsWith('user_')) {
        const username = `user_${clerkId.slice(-6)}`;
        user = await userRepository.create({
          clerkId,
          username,
          displayName: `User ${clerkId.slice(-6)}`,
          avatar: '',
          matchesPlayed: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          totalSubmissions: 0,
          acceptedSubmissions: 0,
          highestWinStreak: 0,
          preferredLanguage: 'javascript',
        });
        return user;
      }
      throw new AppError(`Failed to sync user profile from Clerk: ${error.message}`, 500);
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

  async updateUserProfile(clerkId: string, updateData: Partial<IUser>): Promise<IUserDocument> {
    // Only allow updating specific non-statistic profile fields
    const allowedUpdates: Partial<IUser> = {};
    if (updateData.displayName !== undefined) allowedUpdates.displayName = updateData.displayName;
    if (updateData.avatar !== undefined) allowedUpdates.avatar = updateData.avatar;
    if (updateData.preferredLanguage !== undefined) allowedUpdates.preferredLanguage = updateData.preferredLanguage;

    const user = await userRepository.updateByClerkId(clerkId, allowedUpdates);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  /**
   * Calculate global leaderboard based strictly on COMPLETED battles.
   */
  async getLeaderboard(
    options: { page?: number; limit?: number },
    currentUserId?: string
  ): Promise<ILeaderboardResponse> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));

    // Fetch all users
    const allUsers = await UserModel.find({}).sort({ createdAt: 1 }).exec();

    // Fetch all completed battles
    const completedBattles = await BattleModel.find({ status: BattleStatus.COMPLETED })
      .populate('players.userId', 'username displayName avatar')
      .populate('winnerId', 'username displayName avatar')
      .exec();

    // Compute stats for each user based strictly on COMPLETED battles
    const userStats = allUsers.map((user) => {
      const uIdStr = user._id.toString();

      // Find user's completed battles
      const battles = completedBattles.filter((b) =>
        b.players.some((p) => {
          const pId = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
          return pId === uIdStr;
        })
      );

      let wins = 0;
      let losses = 0;
      let draws = 0;
      let totalCorrect = 0;
      let totalQuestions = 0;

      for (const b of battles) {
        const pObj = b.players.find((p) => {
          const pId = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
          return pId === uIdStr;
        });

        if (pObj) {
          totalQuestions += b.questionCount;
          totalCorrect += pObj.answers ? pObj.answers.filter((a) => a.isCorrect).length : 0;
        }

        const winnerIdStr = b.winnerId
          ? (b.winnerId as any)._id
            ? (b.winnerId as any)._id.toString()
            : b.winnerId.toString()
          : null;

        if (b.isDraw) {
          draws++;
        } else if (winnerIdStr === uIdStr) {
          wins++;
        } else if (winnerIdStr !== null) {
          losses++;
        }
      }

      const battlesPlayed = battles.length;
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      return {
        userId: uIdStr,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        wins,
        losses,
        draws,
        battlesPlayed,
        totalCorrect,
        totalQuestions,
        accuracy,
        isCurrentUser: currentUserId ? uIdStr === currentUserId : false,
      };
    });

    // Transparent & consistent ranking calculation: wins DESC, accuracy DESC, battlesPlayed DESC, username ASC
    userStats.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      if (b.battlesPlayed !== a.battlesPlayed) return b.battlesPlayed - a.battlesPlayed;
      return a.username.localeCompare(b.username);
    });

    // Assign 1-indexed ranks
    const rankedList: ILeaderboardEntry[] = userStats.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    const total = rankedList.length;
    const skip = (page - 1) * limit;
    const paginated = rankedList.slice(skip, skip + limit);

    let currentUserRank: ILeaderboardEntry | null = null;
    if (currentUserId) {
      currentUserRank = rankedList.find((item) => item.userId === currentUserId) || null;
    }

    return {
      leaderboard: paginated,
      total,
      page,
      limit,
      currentUserRank,
    };
  }

  /**
   * Get public profile and completed battle stats for a user by username.
   */
  async getUserProfileByUsername(username: string, currentUserId?: string): Promise<IPublicUserProfile> {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new AppError(`User '${username}' not found`, 404);
    }

    const uIdStr = user._id.toString();

    // Fetch user's completed battles
    const userBattles = await BattleModel.find({
      'players.userId': user._id,
      status: BattleStatus.COMPLETED,
    })
      .sort({ endedAt: -1, startedAt: -1 })
      .populate('players.userId', 'username displayName avatar')
      .populate('winnerId', 'username displayName avatar')
      .exec();

    let wins = 0;
    let losses = 0;
    let draws = 0;
    let totalCorrect = 0;
    let totalQuestions = 0;

    for (const b of userBattles) {
      const pObj = b.players.find((p) => {
        const pId = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
        return pId === uIdStr;
      });

      if (pObj) {
        totalQuestions += b.questionCount;
        totalCorrect += pObj.answers ? pObj.answers.filter((a) => a.isCorrect).length : 0;
      }

      const winnerIdStr = b.winnerId
        ? (b.winnerId as any)._id
          ? (b.winnerId as any)._id.toString()
          : b.winnerId.toString()
        : null;

      if (b.isDraw) {
        draws++;
      } else if (winnerIdStr === uIdStr) {
        wins++;
      } else if (winnerIdStr !== null) {
        losses++;
      }
    }

    const battlesPlayed = userBattles.length;
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Calculate global rank
    const leaderboardData = await this.getLeaderboard({ page: 1, limit: 1000 }, uIdStr);
    const userRankItem = leaderboardData.leaderboard.find((item) => item.userId === uIdStr);
    const rank = userRankItem ? userRankItem.rank : 0;

    // Format recent completed battles
    const recentBattles = userBattles.slice(0, 10).map((b) => {
      const p1 = b.players[0];
      const p2 = b.players[1];

      const p1UserId = p1?.userId && (p1.userId as any)._id
        ? (p1.userId as any)._id.toString()
        : p1?.userId?.toString();

      const isP1 = p1UserId === uIdStr;
      const myP = isP1 ? p1 : p2;
      const oppP = isP1 ? p2 : p1;

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
      avatar: user.avatar,
      preferredLanguage: user.preferredLanguage,
      joinedAt: user.createdAt,
      rank,
      battlesPlayed,
      wins,
      losses,
      draws,
      totalCorrect,
      totalQuestions,
      accuracy,
      isCurrentUser: currentUserId ? uIdStr === currentUserId : false,
      recentBattles,
    };
  }
}

export const userService = new UserService();
export default userService;
