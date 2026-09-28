import { QuestionModel } from './question.model.js';
import { IQuestion, IQuestionDocument, QuestionTopic, QuestionDifficulty } from './question.types.js';

export class QuestionRepository {
  /**
   * Find a question by its unique questionId.
   */
  async findByQuestionId(questionId: string): Promise<IQuestionDocument | null> {
    return QuestionModel.findOne({ questionId });
  }

  /**
   * Upsert a question based on its unique questionId to prevent duplicates.
   */
  async upsertQuestion(data: Partial<IQuestion>): Promise<IQuestionDocument> {
    const question = await QuestionModel.findOneAndUpdate(
      { questionId: data.questionId },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
    return question;
  }

  /**
   * Find published questions filtered by topic & difficulty with pagination.
   */
  async findPublished(
    filter: { topic?: string; difficulty?: string } = {},
    options: { page?: number; limit?: number } = {}
  ): Promise<{ questions: IQuestionDocument[]; total: number }> {
    const query: any = { isPublished: true };

    if (filter.topic && filter.topic !== 'all') {
      query.topic = filter.topic;
    }
    if (filter.difficulty && filter.difficulty !== 'all') {
      query.difficulty = filter.difficulty;
    }

    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));
    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      QuestionModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      QuestionModel.countDocuments(query),
    ]);

    return { questions, total };
  }

  /**
   * Randomly sample published questions matching topic & difficulty criteria.
   * Useful for battle question generation.
   */
  async sampleRandomPublished(
    topic: string | undefined,
    difficulty: string,
    count: number
  ): Promise<IQuestionDocument[]> {
    const matchStage: any = { isPublished: true };

    if (topic && topic !== 'all') {
      matchStage.topic = topic;
    }
    if (difficulty && difficulty !== 'all') {
      matchStage.difficulty = difficulty;
    }

    return QuestionModel.aggregate([
      { $match: matchStage },
      { $sample: { size: count } },
    ]);
  }

  /**
   * Count published questions matching topic & difficulty.
   */
  async countMatching(topic?: string, difficulty?: string): Promise<number> {
    const query: any = { isPublished: true };
    if (topic && topic !== 'all') query.topic = topic;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    return QuestionModel.countDocuments(query);
  }
}

export const questionRepository = new QuestionRepository();
export default questionRepository;
