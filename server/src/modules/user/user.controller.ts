import { Request, Response } from 'express';
import { userService } from './user.service.js';
import { AppError } from '../../utils/app-error.js';
import { ApiResponse } from '../../shared/utils/api-response.js';

export class UserController {
  /**
   * GET /api/v1/users/me
   * Retrieves the currently authenticated user's full profile.
   */
  async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError('Unauthorized: User profile not resolved', 401);
    }
    res.status(200).json(
      new ApiResponse(200, req.user, 'User profile retrieved successfully.')
    );
  }

  /**
   * PATCH /api/v1/users/me
   * Updates fields of the authenticated user profile.
   */
  async updateMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError('Unauthorized: User profile not resolved', 401);
    }
    const updatedUser = await userService.updateUserProfile(req.user.clerkId, req.body);
    res.status(200).json(
      new ApiResponse(200, updatedUser, 'Profile updated successfully.')
    );
  }

  /**
   * GET /api/v1/users/:username
   * Retrieves the public profile of a user by username.
   * Strips all internal, non-public fields.
   */
  async getByUsername(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    if (!username) {
      throw new AppError('Username parameter is required', 400);
    }
    const user = await userService.getUserByUsername(username);

    // Limit returned fields to public profile information only
    const publicProfile = {
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      matchesPlayed: user.matchesPlayed,
      wins: user.wins,
      losses: user.losses,
      draws: user.draws,
    };

    res.status(200).json(
      new ApiResponse(200, publicProfile, 'User profile retrieved successfully.')
    );
  }
}

export const userController = new UserController();
export default userController;
