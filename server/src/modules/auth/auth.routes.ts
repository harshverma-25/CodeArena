import { Router, Request, Response, NextFunction } from 'express';
import { authController } from './auth.controller.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import {
  createGuestSessionSchema,
  registerSchema,
  loginSchema,
  refreshSchema,
} from './auth.validator.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// In-memory rate limiting map for guest session creation & auth endpoints
const guestCreationCounts = new Map<string, { count: number; resetTime: number }>();
const GUEST_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_GUEST_CREATIONS = 20; // 20 guest registrations per 15 min per IP

function guestRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = guestCreationCounts.get(ip);
  if (!record || now > record.resetTime) {
    guestCreationCounts.set(ip, { count: 1, resetTime: now + GUEST_WINDOW_MS });
    return next();
  }

  record.count++;
  if (record.count > MAX_GUEST_CREATIONS) {
    throw new ApiError(429, 'Too many guest sessions created from this IP. Please try again later.');
  }

  next();
}

// POST /api/v1/auth/register
router.post(
  '/register',
  validateRequest(registerSchema),
  asyncHandler((req: Request, res: Response) => authController.register(req, res))
);

// POST /api/v1/auth/login
router.post(
  '/login',
  validateRequest(loginSchema),
  asyncHandler((req: Request, res: Response) => authController.login(req, res))
);

// POST /api/v1/auth/refresh
router.post(
  '/refresh',
  validateRequest(refreshSchema),
  asyncHandler((req: Request, res: Response) => authController.refresh(req, res))
);

// POST /api/v1/auth/logout
router.post(
  '/logout',
  optionalAuthenticate,
  asyncHandler((req: Request, res: Response) => authController.logout(req, res))
);

// GET /api/v1/auth/me
router.get(
  '/me',
  authenticate,
  asyncHandler((req: Request, res: Response) => authController.getMe(req, res))
);

// POST /api/v1/auth/guest
router.post(
  '/guest',
  guestRateLimiter,
  validateRequest(createGuestSessionSchema),
  asyncHandler((req: Request, res: Response) => authController.createGuest(req, res))
);

export const authRoutes = router;
export default authRoutes;

