import { questionRepository, QuestionRepository } from './question.repository.js';
import { IQuestionDocument, ISanitizedQuestion, IQuestion } from './question.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { logger } from '../../config/logger.js';

export class QuestionService {
  constructor(private repository: QuestionRepository = questionRepository) {}

  /**
   * Helper to strip correctAnswer and explanation before returning data to clients.
   * STRICT ANTI-CHEAT RULE: Never expose answer/explanation during battle or public listing.
   */
  public sanitizeQuestion(doc: IQuestionDocument): ISanitizedQuestion {
    return {
      _id: doc._id.toString(),
      questionId: doc.questionId,
      categoryId: doc.categoryId ? doc.categoryId.toString() : undefined,
      subjectId: doc.subjectId ? doc.subjectId.toString() : undefined,
      topic: doc.topic,
      difficulty: doc.difficulty,
      question: doc.question,
      options: doc.options,
      isPublished: doc.isPublished,
    };
  }

  /**
   * Retrieve paginated list of published sanitized questions.
   */
  async getQuestions(
    query: { categoryId?: string; subjectId?: string; isMixedCategory?: boolean; topic?: string; difficulty?: string; page?: number; limit?: number }
  ): Promise<{ questions: ISanitizedQuestion[]; total: number; page: number; limit: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const { questions, total } = await this.repository.findPublished(
      { categoryId: query.categoryId, subjectId: query.subjectId, isMixedCategory: query.isMixedCategory, topic: query.topic, difficulty: query.difficulty },
      { page, limit }
    );

    return {
      questions: questions.map((q) => this.sanitizeQuestion(q)),
      total,
      page,
      limit,
    };
  }

  /**
   * Retrieve a single sanitized question by questionId.
   */
  async getQuestionByQuestionId(questionId: string): Promise<ISanitizedQuestion> {
    const question = await this.repository.findByQuestionId(questionId);
    if (!question || !question.isPublished) {
      throw new ApiError(404, `Question with ID '${questionId}' not found`);
    }
    return this.sanitizeQuestion(question);
  }

  /**
   * Seed/upsert a batch of questions into the database without duplicates.
   */
  async seedQuestions(questionsData: Partial<IQuestion>[]): Promise<{ inserted: number; updated: number }> {
    let inserted = 0;
    let updated = 0;

    for (const qData of questionsData) {
      if (!qData.questionId) {
        logger.warn('Skipping question missing questionId field');
        continue;
      }
      const existing = await this.repository.findByQuestionId(qData.questionId);
      if (existing) {
        updated++;
      } else {
        inserted++;
      }
      await this.repository.upsertQuestion(qData);
    }

    logger.info(`Seeded Question Bank: ${inserted} inserted, ${updated} updated.`);
    return { inserted, updated };
  }
}

export const questionService = new QuestionService();
export default questionService;
