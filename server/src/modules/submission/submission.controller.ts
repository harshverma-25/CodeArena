import { Request, Response } from 'express';
import { submissionService } from './submission.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { ISubmissionDocument } from './submission.types.js';

/**
 * Formats a submission document to ensure clean and sanitized response outputs.
 */
function formatSubmissionResponse(sub: any) {
  return {
    _id: sub._id.toString(),
    matchId: sub.matchId?._id ? sub.matchId._id.toString() : sub.matchId?.toString(),
    userId: sub.userId ? {
      _id: sub.userId._id ? sub.userId._id.toString() : sub.userId.toString(),
      username: sub.userId.username || '',
      displayName: sub.userId.displayName || '',
      avatar: sub.userId.avatar || '',
    } : null,
    submissionNumber: sub.submissionNumber,
    language: sub.language,
    sourceCode: sub.sourceCode,
    verdict: sub.verdict,
    executionTime: sub.executionTime,
    memoryUsed: sub.memoryUsed,
    passedTestCases: sub.passedTestCases,
    totalTestCases: sub.totalTestCases,
    stdout: sub.stdout,
    stderr: sub.stderr,
    compileOutput: sub.compileOutput,
    isFinalAccepted: sub.isFinalAccepted,
    submittedAt: sub.submittedAt,
    judgedAt: sub.judgedAt,
  };
}

export class SubmissionController {
  /**
   * POST /api/v1/submissions
   * Submit code for a match.
   */
  async submitCode(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { matchId, language, sourceCode } = req.body;
    const userId = req.user._id.toString();

    const submission = await submissionService.submitCode(
      userId,
      matchId,
      language,
      sourceCode
    );

    res.status(201).json(
      new ApiResponse(201, formatSubmissionResponse(submission), 'Submission processed successfully.')
    );
  }

  /**
   * GET /api/v1/submissions/:submissionId
   * Retrieve details of a specific submission.
   */
  async getSubmission(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { submissionId } = req.params;
    const userId = req.user._id.toString();

    const submission = await submissionService.getSubmission(userId, submissionId);

    res.status(200).json(
      new ApiResponse(200, formatSubmissionResponse(submission), 'Submission details retrieved successfully.')
    );
  }

  /**
   * GET /api/v1/matches/:matchId/submissions
   * Retrieve all submissions for a specific match.
   */
  async getMatchSubmissions(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { matchId } = req.params;
    const userId = req.user._id.toString();

    const submissions = await submissionService.getMatchSubmissions(userId, matchId);

    res.status(200).json(
      new ApiResponse(
        200,
        submissions.map(formatSubmissionResponse),
        'Match submissions retrieved successfully.'
      )
    );
  }

  /**
   * POST /api/v1/submissions/run
   * Run code with custom inputs.
   */
  async runCode(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { matchId, language, sourceCode, customInput } = req.body;
    const userId = req.user._id.toString();

    const result = await submissionService.runCode(
      userId,
      matchId,
      language,
      sourceCode,
      customInput
    );

    res.status(200).json(
      new ApiResponse(200, result, 'Code executed successfully.')
    );
  }
}

export const submissionController = new SubmissionController();
export default submissionController;
