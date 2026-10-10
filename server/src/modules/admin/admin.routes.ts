import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { authenticate, authorizeAdmin } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import {
  createCategorySchema,
  updateCategorySchema,
  createSubjectSchema,
  updateSubjectSchema,
  previewImportSchema,
  executeImportSchema,
  listImportHistorySchema,
} from './admin.validation.js';

const router = Router();

// Protect ALL admin routes with authenticate + authorizeAdmin
router.use(asyncHandler(authenticate));
router.use(authorizeAdmin);

// 1. Overview metrics
router.get(
  '/overview',
  asyncHandler((req, res) => adminController.getOverview(req, res))
);

// 2. Categories & Subjects Tree Management
router.get(
  '/categories',
  asyncHandler((req, res) => adminController.getCategoriesTree(req, res))
);

router.post(
  '/categories',
  validateRequest(createCategorySchema),
  asyncHandler((req, res) => adminController.createCategory(req, res))
);

router.patch(
  '/categories/:id',
  validateRequest(updateCategorySchema),
  asyncHandler((req, res) => adminController.updateCategory(req, res))
);

router.post(
  '/subjects',
  validateRequest(createSubjectSchema),
  asyncHandler((req, res) => adminController.createSubject(req, res))
);

router.patch(
  '/subjects/:id',
  validateRequest(updateSubjectSchema),
  asyncHandler((req, res) => adminController.updateSubject(req, res))
);

// 3. Question JSON Import
router.get(
  '/import/sample',
  (req, res) => adminController.getSampleJson(req, res)
);

router.post(
  '/import/preview',
  validateRequest(previewImportSchema),
  asyncHandler((req, res) => adminController.previewImport(req, res))
);

router.post(
  '/import/execute',
  validateRequest(executeImportSchema),
  asyncHandler((req, res) => adminController.executeImport(req, res))
);

// 4. Import History
router.get(
  '/history',
  validateRequest(listImportHistorySchema),
  asyncHandler((req, res) => adminController.listImportHistory(req, res))
);

router.get(
  '/history/:importId',
  asyncHandler((req, res) => adminController.getImportDetails(req, res))
);

export const adminRoutes = router;
export default adminRoutes;
