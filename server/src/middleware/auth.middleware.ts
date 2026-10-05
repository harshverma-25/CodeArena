import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/errors/api-error.js';
import { userService } from '../modules/user/user.service.js';
import { env } from '../config/env.js';
import { authService } from '../modules/auth/auth.service.js';
import { UserModel } from '../modules/user/user.model.js';
import { Types } from 'mongoose';

export const resolveUserFromToken = async (req: Request): Promise<any> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return null;
  }

  // 1. Check Native Access Token
  const accessPayload = authService.verifyAccessToken(token);
  if (accessPayload && accessPayload.sub) {
    if (Types.ObjectId.isValid(accessPayload.sub)) {
      const user = await UserModel.findById(accessPayload.sub);
      if (user) return user;
    }
  }

  // 2. Check Guest JWT Token
  const guestPayload = authService.verifyGuestToken(token);
  if (guestPayload) {
    if (guestPayload.sub && Types.ObjectId.isValid(guestPayload.sub)) {
      const user = await UserModel.findById(guestPayload.sub);
      if (user) return user;
    }
    if (guestPayload.guestId) {
      const user = await userService.getUserByClerkId(guestPayload.guestId);
      if (user && user.isGuest) return user;
    }
  }

  // 3. Automated test suite bypass strictly in NODE_ENV === 'test'
  if (env.NODE_ENV === 'test' && token.startsWith('mock_test_token_')) {
    const testId = token.replace('mock_test_token_', '');
    return userService.getOrCreateUser(testId);
  }

  return null;
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await resolveUserFromToken(req);
    if (!user) {
      throw new ApiError(401, 'Unauthorized: Authentication required');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await resolveUserFromToken(req);
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};
