import { Router } from 'express';
import { submissionController } from './submission.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import {
  submitCodeSchema,
  submissionIdParamSchema,
  runCodeSchema,
} from './submission.validation.js';
import { asyncHandler } from '../../utils/async-handler.js';

const router = Router();

// Protect all routes with authentication middleware
router.use(asyncHandler(authenticate));

// Route: POST /submissions
router.post(
  '/',
  validateRequest(submitCodeSchema),
  asyncHandler((req, res) => submissionController.submitCode(req, res))
);

// Route: POST /submissions/run
router.post(
  '/run',
  validateRequest(runCodeSchema),
  asyncHandler((req, res) => submissionController.runCode(req, res))
);

// Route: GET /submissions/:submissionId
router.get(
  '/:submissionId',
  validateRequest(submissionIdParamSchema),
  asyncHandler((req, res) => submissionController.getSubmission(req, res))
);

export const submissionRoutes = router;
export default submissionRoutes;
