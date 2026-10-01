import { Router } from 'express';
import { userController } from './user.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import {
  updateUserSchema,
  getUserByUsernameSchema,
  leaderboardQuerySchema,
} from './user.validation.js';
import { asyncHandler } from '../../utils/async-handler.js';

const router = Router();

// Protect user routes
router.use(asyncHandler(authenticate));

// GET /api/v1/users/me - get current user document
router.get('/me', asyncHandler((req, res) => userController.getMe(req, res)));

// GET /api/v1/users/profile/me - get current user statistics report
router.get('/profile/me', asyncHandler((req, res) => userController.getMyProfile(req, res)));

// GET /api/v1/leaderboard or /api/v1/users/leaderboard - get global leaderboard
router.get(
  '/leaderboard',
  validateRequest(leaderboardQuerySchema),
  asyncHandler((req, res) => userController.getLeaderboard(req, res))
);

router.get(
  '/',
  validateRequest(leaderboardQuerySchema),
  asyncHandler((req, res) => userController.getLeaderboard(req, res))
);

// PATCH /api/v1/users/me - update profile settings
router.patch(
  '/me',
  validateRequest(updateUserSchema),
  asyncHandler((req, res) => userController.updateMe(req, res))
);

// GET /api/v1/users/profile/:username - get public profile by username
router.get(
  '/profile/:username',
  validateRequest(getUserByUsernameSchema),
  asyncHandler((req, res) => userController.getByUsername(req, res))
);

// GET /api/v1/users/:username - get public profile by username (alias)
router.get(
  '/:username',
  validateRequest(getUserByUsernameSchema),
  asyncHandler((req, res) => userController.getByUsername(req, res))
);

export const userRoutes = router;
export default userRoutes;
