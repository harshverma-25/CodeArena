import { Router } from 'express';
import { problemController } from './problem.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import {
  getProblemsSchema,
  getProblemBySlugSchema,
  getRandomProblemSchema,
} from './problem.validation.js';
import { asyncHandler } from '../../utils/async-handler.js';

const router = Router();

// Protect all problem routes using authenticate middleware
router.use(asyncHandler(authenticate));

// Route: GET /problems
router.get(
  '/',
  validateRequest(getProblemsSchema),
  asyncHandler((req, res) => problemController.getProblems(req, res))
);

// Route: GET /problems/random
// Note: Must be defined before '/:slug' to avoid route conflict
router.get(
  '/random',
  validateRequest(getRandomProblemSchema),
  asyncHandler((req, res) => problemController.getRandomProblem(req, res))
);

// Route: GET /problems/availability
router.get(
  '/availability',
  asyncHandler((req, res) => problemController.getAvailability(req, res))
);

// Route: GET /problems/:slug
router.get(
  '/:slug',
  validateRequest(getProblemBySlugSchema),
  asyncHandler((req, res) => problemController.getProblemBySlug(req, res))
);

export const problemRoutes = router;
export default problemRoutes;
