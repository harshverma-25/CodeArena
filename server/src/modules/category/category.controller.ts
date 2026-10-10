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
   * GET /api/v1/categories/popular
   * List genuinely popular/most-played quizzes from completed battles.
   */
  async getPopularQuizzes(req: Request, res: Response) {
    const limit = Math.min(10, Math.max(1, parseInt(req.query.limit as string, 10) || 5));
    const popular = await categoryService.getPopularQuizzes(limit);
    return res.status(200).json(
      new ApiResponse(200, popular, 'Popular quizzes retrieved successfully')
    );
  }

  /**
   * GET /api/v1/categories/:categoryId
   * Retrieve single category details.
   */
  async getCategoryById(req: Request, res: Response) {
    const { categoryId } = req.params;
    const category = await categoryService.getCategoryDetails(categoryId);
    return res.status(200).json(
      new ApiResponse(200, category, 'Category retrieved successfully')
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
