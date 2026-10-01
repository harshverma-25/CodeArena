import { Request, Response } from 'express';
import { userService } from './user.service.js';
import { AppError } from '../../utils/app-error.js';
import { ApiResponse } from '../../shared/utils/api-response.js';

export class UserController {
  /**
   * GET /api/v1/users/me
   * Retrieves the currently authenticated user's full profile document.
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
   * GET /api/v1/users/profile/me
   * Retrieves the currently authenticated user's calculated statistics and profile report.
   */
  async getMyProfile(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError('Unauthorized: User profile not resolved', 401);
    }
    const profile = await userService.getUserProfileByUsername(req.user.username, req.user._id.toString());
    res.status(200).json(
      new ApiResponse(200, profile, 'User profile statistics retrieved successfully.')
    );
  }

  /**
   * PATCH /api/v1/users/me
   * Updates display fields of the authenticated user profile.
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
   * GET /api/v1/users/leaderboard (or /api/v1/leaderboard)
   * Retrieves global leaderboard rankings computed from completed battles.
   */
  async getLeaderboard(req: Request, res: Response): Promise<void> {
    const page = typeof req.query.page === 'number' ? req.query.page : parseInt(req.query.page as string, 10) || 1;
    const limit = typeof req.query.limit === 'number' ? req.query.limit : parseInt(req.query.limit as string, 10) || 10;
    const currentUserId = req.user ? req.user._id.toString() : undefined;

    const data = await userService.getLeaderboard({ page, limit }, currentUserId);

    res.status(200).json(
      new ApiResponse(200, data, 'Leaderboard retrieved successfully.')
    );
  }

  /**
   * GET /api/v1/users/:username or /api/v1/users/profile/:username
   * Retrieves the public profile and completed battle statistics of a user by username.
   */
  async getByUsername(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    if (!username) {
      throw new AppError('Username parameter is required', 400);
    }
    const currentUserId = req.user ? req.user._id.toString() : undefined;
    const profile = await userService.getUserProfileByUsername(username, currentUserId);

    res.status(200).json(
      new ApiResponse(200, profile, 'User public profile retrieved successfully.')
    );
  }
}

export const userController = new UserController();
export default userController;
