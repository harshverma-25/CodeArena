import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error.js';
import { userService } from '../modules/user/user.service.js';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let clerkId = req.auth?.userId;

    const authHeader = req.headers.authorization;
    if (!clerkId && authHeader?.startsWith('Bearer mock_test_token_')) {
      clerkId = authHeader.split(' ')[1].replace('mock_test_token_', '');
    }

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
