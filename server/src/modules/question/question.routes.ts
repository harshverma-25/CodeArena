import { Router } from 'express';
import { questionController } from './question.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { listQuestionsSchema, getQuestionParamSchema } from './question.validation.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { noCache } from '../../middleware/cache.middleware.js';

const router = Router();

// Protect all question routes using authenticate and noCache middleware
router.use(asyncHandler(authenticate));
router.use(noCache);

// Route: GET /api/v1/questions
router.get(
  '/',
  validateRequest(listQuestionsSchema),
  asyncHandler((req, res) => questionController.getQuestions(req, res))
);

// Route: GET /api/v1/questions/:questionId
router.get(
  '/:questionId',
  validateRequest(getQuestionParamSchema),
  asyncHandler((req, res) => questionController.getQuestionByQuestionId(req, res))
);

export const questionRoutes = router;
export default questionRoutes;
