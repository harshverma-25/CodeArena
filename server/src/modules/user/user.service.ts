import { clerkClient } from '../../config/clerk.js';
import { userRepository } from './user.repository.js';
import { IUserDocument, IUser } from './user.types.js';
import { AppError } from '../../utils/app-error.js';

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
    // Only allow updating specific fields
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
}

export const userService = new UserService();
