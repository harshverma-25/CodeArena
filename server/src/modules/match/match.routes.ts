import { Router } from 'express';
import { matchController } from './match.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import {
  startMatchSchema,
  matchIdParamSchema,
  matchHistorySchema,
} from './match.validation.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { submissionController } from '../submission/submission.controller.js';
import { matchSubmissionsParamSchema } from '../submission/submission.validation.js';

const router = Router();

// Protect all match routes using authenticate middleware
router.use(asyncHandler(authenticate));

// Route: POST /matches/start
router.post(
  '/start',
  validateRequest(startMatchSchema),
  asyncHandler((req, res) => matchController.startMatch(req, res))
);

// Route: GET /matches/history
router.get(
  '/history',
  validateRequest(matchHistorySchema),
  asyncHandler((req, res) => matchController.getMatchHistory(req, res))
);

// Route: GET /matches/:matchId
router.get(
  '/:matchId',
  validateRequest(matchIdParamSchema),
  asyncHandler((req, res) => matchController.getMatch(req, res))
);

// Route: GET /matches/:matchId/submissions
router.get(
  '/:matchId/submissions',
  validateRequest(matchSubmissionsParamSchema),
  asyncHandler((req, res) => submissionController.getMatchSubmissions(req, res))
);

export const matchRoutes = router;
export default matchRoutes;
