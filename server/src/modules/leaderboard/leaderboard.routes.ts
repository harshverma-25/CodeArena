import { Router } from 'express';
import { userController } from '../user/user.controller.js';
import { optionalAuthenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { leaderboardQuerySchema } from '../user/user.validation.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';

const router = Router();

// Route: GET /api/v1/leaderboard
router.get(
  '/',
  asyncHandler(optionalAuthenticate),
  validateRequest(leaderboardQuerySchema),
  asyncHandler((req, res) => userController.getLeaderboard(req, res))
);

export const leaderboardRoutes = router;
export default leaderboardRoutes;
