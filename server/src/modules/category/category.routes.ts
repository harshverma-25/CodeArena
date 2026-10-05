import { Router } from 'express';
import { categoryController } from './category.controller.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';

const router = Router();

// Route: GET /api/v1/categories
router.get(
  '/',
  asyncHandler((req, res) => categoryController.getCategories(req, res))
);

// Route: GET /api/v1/categories/:categoryId/subjects
router.get(
  '/:categoryId/subjects',
  asyncHandler((req, res) => categoryController.getSubjects(req, res))
);

export const categoryRoutes = router;
export default categoryRoutes;
