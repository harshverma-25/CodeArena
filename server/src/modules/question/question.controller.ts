import { Request, Response } from 'express';
import { questionService } from './question.service.js';

export class QuestionController {
  /**
   * GET /api/v1/questions
   * Retrieve paginated list of published sanitized questions.
   */
  async getQuestions(req: Request, res: Response): Promise<void> {
    const { topic, difficulty, page, limit } = req.query as any;
    const result = await questionService.getQuestions({
      topic: topic ? String(topic) : undefined,
      difficulty: difficulty ? String(difficulty) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res.status(200).json({
      success: true,
      message: 'Published questions retrieved successfully',
      data: result,
    });
  }

  /**
   * GET /api/v1/questions/:questionId
   * Retrieve single sanitized question by questionId.
   */
  async getQuestionByQuestionId(req: Request, res: Response): Promise<void> {
    const { questionId } = req.params;
    const question = await questionService.getQuestionByQuestionId(questionId);

    res.status(200).json({
      success: true,
      message: 'Question retrieved successfully',
      data: question,
    });
  }
}

export const questionController = new QuestionController();
export default questionController;
