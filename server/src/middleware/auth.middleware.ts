import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/api-error.js';

import { userService } from '../modules/user/user.service.js';
import { env } from '../config/env.js';
import { authService } from '../modules/auth/auth.service.js';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let clerkId = req.auth?.userId;

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // 1. Verify backend-issued Guest JWT if not authenticated by Clerk
    if (!clerkId && token) {
      const guestPayload = authService.verifyGuestToken(token);
      if (guestPayload) {
        const guestUser = await userService.getUserByClerkId(guestPayload.guestId);
        if (guestUser && guestUser.isGuest) {
          req.user = guestUser;
          return next();
        }
      }
    }

    // 2. Automated test suite bypass strictly in NODE_ENV === 'test'
    if (env.NODE_ENV === 'test' && !clerkId && token?.startsWith('mock_test_token_')) {
      clerkId = token.replace('mock_test_token_', '');
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
