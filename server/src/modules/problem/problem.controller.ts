import { Request, Response } from 'express';
import { problemService } from './problem.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';

export class ProblemController {
  /**
   * GET /api/v1/problems
   */
  async getProblems(req: Request, res: Response): Promise<void> {
    const { page, limit, topic, difficulty, search } = req.query as any;

    const result = await problemService.getProblems(
      { topic, difficulty, search },
      { page, limit }
    );

    res.status(200).json(
      new ApiResponse(200, result, 'Problems retrieved successfully.')
    );
  }

  /**
   * GET /api/v1/problems/:slug
   */
  async getProblemBySlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params;

    const problem = await problemService.getProblemBySlug(slug);

    res.status(200).json(
      new ApiResponse(200, problem, 'Problem retrieved successfully.')
    );
  }

  /**
   * GET /api/v1/problems/random
   */
  async getRandomProblem(req: Request, res: Response): Promise<void> {
    const { topic, difficulty } = req.query as any;

    const problem = await problemService.getRandomProblem({ topic, difficulty });

    res.status(200).json(
      new ApiResponse(200, problem, 'Random problem retrieved successfully.')
    );
  }

  /**
   * GET /api/v1/problems/availability
   */
  async getAvailability(req: Request, res: Response): Promise<void> {
    const availability = await problemService.getAvailability();
    res.status(200).json(
      new ApiResponse(200, availability, 'Problem availability matrix retrieved successfully.')
    );
  }
}

export const problemController = new ProblemController();
export default problemController;
