import { Router } from 'express';
import { historyController } from './history.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { historyQuerySchema, battleIdParamSchema } from './history.validator.js';
import { asyncHandler } from '../../utils/async-handler.js';

const router = Router();

// Protect all history routes
router.use(asyncHandler(authenticate));

// GET /api/v1/history - list paginated match history
router.get(
  '/',
  validateRequest(historyQuerySchema),
  asyncHandler((req, res) => historyController.getMatchHistory(req, res))
);

// GET /api/v1/history/battles/:battleId - detailed battle results
router.get(
  '/battles/:battleId',
  validateRequest(battleIdParamSchema),
  asyncHandler((req, res) => historyController.getBattleResults(req, res))
);

// GET /api/v1/history/:battleId - detailed battle results (alias route)
router.get(
  '/:battleId',
  validateRequest(battleIdParamSchema),
  asyncHandler((req, res) => historyController.getBattleResults(req, res))
);

export const historyRoutes = router;
export default historyRoutes;
