import { Request, Response } from 'express';
import { historyService } from './history.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { ApiError } from '../../shared/errors/api-error.js';

export class HistoryController {
  /**
   * GET /api/v1/history
   * Retrieve paginated match history for authenticated user.
   */
  async getMatchHistory(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const page = typeof req.query.page === 'number' ? req.query.page : parseInt(req.query.page as string, 10) || 1;
    const limit = typeof req.query.limit === 'number' ? req.query.limit : parseInt(req.query.limit as string, 10) || 10;

    const data = await historyService.getMatchHistory(req.user._id.toString(), {
      page,
      limit,
    });

    res.status(200).json(
      new ApiResponse(200, data, 'Match history retrieved successfully.')
    );
  }

  /**
   * GET /api/v1/history/battles/:battleId
   * Retrieve detailed results of a completed battle for authenticated participant.
   */
  async getBattleResults(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { battleId } = req.params;
    const results = await historyService.getBattleResults(battleId, req.user._id.toString());

    res.status(200).json(
      new ApiResponse(200, results, 'Battle results retrieved successfully.')
    );
  }
}

export const historyController = new HistoryController();
export default historyController;
