import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { authenticate, authorizeAdmin } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { asyncHandler } from '../../shared/utils/async-handler.js';
import { noCache } from '../../middleware/cache.middleware.js';
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  createSubjectSchema,
  updateSubjectSchema,
  deleteSubjectSchema,
  deleteQuestionSchema,
  getSubjectQuestionsSchema,
  previewImportSchema,
  executeImportSchema,
  listImportHistorySchema,
} from './admin.validation.js';

const router = Router();

// Protect ALL admin routes with authenticate + authorizeAdmin and strict noCache
router.use(asyncHandler(authenticate));
router.use(authorizeAdmin);
router.use(noCache);

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

router.delete(
  '/categories/:id',
  validateRequest(deleteCategorySchema),
  asyncHandler((req, res) => adminController.deleteCategory(req, res))
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

router.delete(
  '/subjects/:id',
  validateRequest(deleteSubjectSchema),
  asyncHandler((req, res) => adminController.deleteSubject(req, res))
);

router.delete(
  '/subjects/:id/questions',
  validateRequest(deleteSubjectSchema),
  asyncHandler((req, res) => adminController.deleteSubjectQuestions(req, res))
);

router.get(
  '/subjects/:id/questions',
  validateRequest(getSubjectQuestionsSchema),
  asyncHandler((req, res) => adminController.getSubjectQuestions(req, res))
);

router.delete(
  '/questions/:id',
  validateRequest(deleteQuestionSchema),
  asyncHandler((req, res) => adminController.deleteQuestion(req, res))
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
