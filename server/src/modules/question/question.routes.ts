import { Router } from 'express';
import { questionController } from './question.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { listQuestionsSchema, getQuestionParamSchema } from './question.validation.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';


const router = Router();

// Protect all question routes using authenticate middleware
router.use(asyncHandler(authenticate));

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
