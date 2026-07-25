import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';
import { userService } from '../modules/user/user.service.js';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clerkId = req.auth?.userId;

    if (!clerkId) {
      throw new AppError('Unauthorized: Authentication required', 401);
    }

    // Retrieve or auto-sync the database user
    const dbUser = await userService.getOrCreateUser(clerkId);

    // Attach to the request object for downstream controllers and services
    req.user = dbUser;
    
    next();
  } catch (error) {
    next(error);
  }
};
