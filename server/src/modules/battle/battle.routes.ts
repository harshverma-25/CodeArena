import { Router } from 'express';
import { battleController } from './battle.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { startBattleSchema } from './battle.validation.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';

const router = Router();

// Protect all battle routes using authenticate middleware
router.use(asyncHandler(authenticate));

// Route: POST /battles/start
router.post(
  '/start',
  validateRequest(startBattleSchema),
  asyncHandler((req, res) => battleController.startBattle(req, res))
);

export const battleRoutes = router;
export default battleRoutes;
