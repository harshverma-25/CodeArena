import { Router } from 'express';
import { userController } from './user.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { updateUserSchema } from './user.validation.js';
import { asyncHandler } from '../../utils/async-handler.js';

const router = Router();

// Protect all user routes using authenticate middleware
router.use(asyncHandler(authenticate));

router.get('/me', asyncHandler((req, res) => userController.getMe(req, res)));
router.patch('/me', validateRequest(updateUserSchema), asyncHandler((req, res) => userController.updateMe(req, res)));
router.get('/:username', asyncHandler((req, res) => userController.getByUsername(req, res)));

export const userRoutes = router;
export default userRoutes;
