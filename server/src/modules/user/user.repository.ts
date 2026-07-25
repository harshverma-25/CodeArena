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
    stats: { matchesPlayed?: number; wins?: number; losses?: number; draws?: number; totalSubmissions?: number; acceptedSubmissions?: number }
  ): Promise<IUserDocument | null> {
    const update: any = { $inc: {} };
    if (stats.matchesPlayed) update.$inc.matchesPlayed = stats.matchesPlayed;
    if (stats.wins) update.$inc.wins = stats.wins;
    if (stats.losses) update.$inc.losses = stats.losses;
    if (stats.draws) update.$inc.draws = stats.draws;
    if (stats.totalSubmissions) update.$inc.totalSubmissions = stats.totalSubmissions;
    if (stats.acceptedSubmissions) update.$inc.acceptedSubmissions = stats.acceptedSubmissions;

    return UserModel.findOneAndUpdate({ clerkId }, update, { new: true });
  }
}

export const userRepository = new UserRepository();
