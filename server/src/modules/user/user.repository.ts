import { UserModel } from './user.model.js';
import { IUser, IUserDocument } from './user.types.js';

export class UserRepository {
  async findByClerkId(clerkId: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ clerkId });
  }

  async findByUsername(username: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ username });
  }

  async create(userData: Partial<IUser>): Promise<IUserDocument> {
    const user = new UserModel(userData);
    return user.save();
  }

  async updateByClerkId(clerkId: string, updateData: Partial<IUser>): Promise<IUserDocument | null> {
    return UserModel.findOneAndUpdate({ clerkId }, updateData, { new: true });
  }

  async incrementStats(
    clerkId: string,
    stats: { matchesPlayed?: number; wins?: number; losses?: number; draws?: number }
  ): Promise<IUserDocument | null> {
    const update: any = { $inc: {} };
    if (stats.matchesPlayed) update.$inc.matchesPlayed = stats.matchesPlayed;
    if (stats.wins) update.$inc.wins = stats.wins;
    if (stats.losses) update.$inc.losses = stats.losses;
    if (stats.draws) update.$inc.draws = stats.draws;

    return UserModel.findOneAndUpdate({ clerkId }, update, { new: true });
  }

  async incrementStatsById(
    userId: string,
    stats: { matchesPlayed?: number; wins?: number; losses?: number; draws?: number }
  ): Promise<IUserDocument | null> {
    const update: any = { $inc: {} };
    if (stats.matchesPlayed) update.$inc.matchesPlayed = stats.matchesPlayed;
    if (stats.wins) update.$inc.wins = stats.wins;
    if (stats.losses) update.$inc.losses = stats.losses;
    if (stats.draws) update.$inc.draws = stats.draws;

    return UserModel.findByIdAndUpdate(userId, update, { new: true });
  }

  async recordBattleStatsById(
    userId: any,
    stats: { isWin: boolean; isLoss: boolean; isDraw: boolean; correctCount: number; questionCount: number }
  ): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      [
        {
          $set: {
            matchesPlayed: { $add: [{ $ifNull: ['$matchesPlayed', 0] }, 1] },
            wins: { $add: [{ $ifNull: ['$wins', 0] }, stats.isWin ? 1 : 0] },
            losses: { $add: [{ $ifNull: ['$losses', 0] }, stats.isLoss ? 1 : 0] },
            draws: { $add: [{ $ifNull: ['$draws', 0] }, stats.isDraw ? 1 : 0] },
            totalCorrect: { $add: [{ $ifNull: ['$totalCorrect', 0] }, stats.correctCount] },
            totalQuestions: { $add: [{ $ifNull: ['$totalQuestions', 0] }, stats.questionCount] },
          },
        },
        {
          $set: {
            accuracy: {
              $cond: [
                { $gt: ['$totalQuestions', 0] },
                { $round: [{ $multiply: [{ $divide: ['$totalCorrect', '$totalQuestions'] }, 100] }, 0] },
                0,
              ],
            },
          },
        },
      ]
    );
  }
}

export const userRepository = new UserRepository();
