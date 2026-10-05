import { Request, Response } from 'express';
import { categoryService } from './category.service.js';

export class CategoryController {
  /**
   * GET /api/v1/categories
   * List all active categories.
   */
  async getCategories(_req: Request, res: Response) {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  }

  /**
   * GET /api/v1/categories/:categoryId/subjects
   * List all active subjects under a specific category.
   */
  async getSubjects(req: Request, res: Response) {
    const { categoryId } = req.params;
    const { category, subjects } = await categoryService.getSubjectsForCategory(categoryId);
    return res.status(200).json({
      success: true,
      message: 'Subjects retrieved successfully',
      data: {
        category,
        subjects,
      },
    });
  }
}

export const categoryController = new CategoryController();
export default categoryController;
