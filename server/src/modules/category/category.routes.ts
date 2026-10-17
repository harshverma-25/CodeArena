import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { categoryParamSchema } from './category.validation.js';
import { publicCache } from '../../middleware/cache.middleware.js';

const router = Router();

// Cache policy: 2 minutes freshness with 5 minutes stale-while-revalidate for public catalogs
const catalogCache = publicCache({ maxAge: 120, staleWhileRevalidate: 300 });

// Route: GET /api/v1/categories
router.get(
  '/',
  catalogCache,
  asyncHandler((req, res) => categoryController.getCategories(req, res))
);

// Route: GET /api/v1/categories/popular
router.get(
  '/popular',
  catalogCache,
  asyncHandler((req, res) => categoryController.getPopularQuizzes(req, res))
);

// Route: GET /api/v1/categories/summary (Aggregated homepage catalog payload)
router.get(
  '/summary',
  catalogCache,
  asyncHandler((req, res) => categoryController.getHomeSummary(req, res))
);

// Route: GET /api/v1/categories/:categoryId
router.get(
  '/:categoryId',
  validateRequest(categoryParamSchema),
  catalogCache,
  asyncHandler((req, res) => categoryController.getCategoryById(req, res))
);

// Route: GET /api/v1/categories/:categoryId/subjects
router.get(
  '/:categoryId/subjects',
  validateRequest(categoryParamSchema),
  catalogCache,
  asyncHandler((req, res) => categoryController.getSubjects(req, res))
);

export const categoryRoutes = router;
export default categoryRoutes;
