import { Request, Response } from 'express';
import { matchService } from './match.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { IMatchDocument } from './match.types.js';

/**
 * Format match details, ensuring hiddenTestCases and referenceSolutions are never exposed.
 */
function formatMatchResponse(match: any) {
  return {
    _id: match._id.toString(),
    roomId: match.roomId?._id ? match.roomId._id.toString() : match.roomId?.toString(),
    roomCode: match.roomId?.roomCode || '',
    players: match.players.map((p: any) => ({
      user: p.userId ? {
        _id: p.userId._id ? p.userId._id.toString() : p.userId.toString(),
        username: p.userId.username || '',
        displayName: p.userId.displayName || '',
        avatar: p.userId.avatar || '',
      } : null,
    })),
    winner: match.winnerId ? {
      _id: match.winnerId._id ? match.winnerId._id.toString() : match.winnerId.toString(),
      username: match.winnerId.username || '',
      displayName: match.winnerId.displayName || '',
      avatar: match.winnerId.avatar || '',
    } : null,
    status: match.status,
    startedAt: match.startedAt,
    endedAt: match.endedAt,
    duration: match.duration,
    problem: match.problemId ? {
      _id: match.problemId._id ? match.problemId._id.toString() : match.problemId.toString(),
      title: match.problemId.title || '',
      description: match.problemId.description || '',
      difficulty: match.problemId.difficulty || '',
      topic: match.problemId.topic || '',
      examples: match.problemId.examples || [],
      constraints: match.problemId.constraints || [],
      starterCode: match.problemId.starterCode || [],
    } : null,
  };
}

export class MatchController {
  /**
   * POST /api/v1/matches/start
   * Start a new match for a room (Host only).
   */
  async startMatch(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { roomCode } = req.body;
    const matchData = await matchService.startMatch(req.user._id.toString(), roomCode);

    res.status(200).json(
      new ApiResponse(200, matchData, 'Match started successfully.')
    );
  }

  /**
   * GET /api/v1/matches/:matchId
   * Retrieve details of a specific match.
   */
  async getMatch(req: Request, res: Response): Promise<void> {
    const { matchId } = req.params;
    const match = await matchService.getMatch(matchId);

    res.status(200).json(
      new ApiResponse(200, formatMatchResponse(match), 'Match details retrieved successfully.')
    );
  }

  /**
   * GET /api/v1/matches/history
   * Retrieve match history for the authenticated user (paginated).
   */
  async getMatchHistory(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { matches, total } = await matchService.getMatchHistory(req.user._id.toString(), {
      page,
      limit,
    });

    res.status(200).json(
      new ApiResponse(
        200,
        {
          matches: matches.map(formatMatchResponse),
          total,
          page,
          limit,
        },
        'Match history retrieved successfully.'
      )
    );
  }
}

export const matchController = new MatchController();
export default matchController;
