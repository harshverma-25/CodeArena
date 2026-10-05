import { Request, Response } from 'express';
import { categoryService } from './category.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';

export class CategoryController {
  /**
   * GET /api/v1/categories
   * List all active categories.
   */
  async getCategories(_req: Request, res: Response) {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json(
      new ApiResponse(200, categories, 'Categories retrieved successfully')
    );
  }

  /**
   * GET /api/v1/categories/:categoryId/subjects
   * List all active subjects under a specific category.
   */
  async getSubjects(req: Request, res: Response) {
    const { categoryId } = req.params;
    const { category, subjects } = await categoryService.getSubjectsForCategory(categoryId);
    return res.status(200).json(
      new ApiResponse(200, { category, subjects }, 'Subjects retrieved successfully')
    );
  }
}

export const categoryController = new CategoryController();
export default categoryController;
