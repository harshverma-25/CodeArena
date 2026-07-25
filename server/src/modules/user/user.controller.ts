import { Request, Response } from 'express';
import { userService } from './user.service.js';
import { AppError } from '../../utils/app-error.js';

export class UserController {
  async getMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError('Unauthorized: User profile not resolved', 401);
    }
    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully.',
      data: req.user,
    });
  }

  async updateMe(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError('Unauthorized: User profile not resolved', 401);
    }
    const updatedUser = await userService.updateUserProfile(req.user.clerkId, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedUser,
    });
  }

  async getByUsername(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    if (!username) {
      throw new AppError('Username parameter is required', 400);
    }
    const user = await userService.getUserByUsername(username);
    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully.',
      data: user,
    });
  }
}

export const userController = new UserController();
export default userController;
