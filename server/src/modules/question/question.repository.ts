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
   * Find multiple questions by an array of questionIds.
   */
  async findByQuestionIds(questionIds: string[]): Promise<IQuestionDocument[]> {
    return QuestionModel.find({ questionId: { $in: questionIds } });
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
   * Randomly sample published questions matching topic & difficulty criteria, excluding optional questionIds.
   * Useful for battle question generation.
   */
  async sampleRandomPublished(
    topic?: string,
    difficulty?: string,
    count: number = 5,
    excludeQuestionIds: string[] = []
  ): Promise<IQuestionDocument[]> {
    const matchStage: any = { isPublished: true };

    if (topic && topic !== 'all' && topic !== 'random') {
      matchStage.topic = topic;
    }
    if (difficulty && difficulty !== 'all' && difficulty !== 'random') {
      matchStage.difficulty = difficulty.toLowerCase();
    }
    if (excludeQuestionIds.length > 0) {
      matchStage.questionId = { $nin: excludeQuestionIds };
    }

    return QuestionModel.aggregate([
      { $match: matchStage },
      { $sample: { size: count } },
    ]);
  }

  /**
   * Retrieve list of unique published topics available in DB.
   */
  async getAvailablePublishedTopics(): Promise<string[]> {
    return QuestionModel.distinct('topic', { isPublished: true });
  }

  /**
   * Count published questions matching topic & difficulty.
   */
  async countMatching(topic?: string, difficulty?: string): Promise<number> {
    const query: any = { isPublished: true };
    if (topic && topic !== 'all' && topic !== 'random') {
      query.topic = topic;
    }
    if (difficulty && difficulty !== 'all' && difficulty !== 'random') {
      query.difficulty = difficulty.toLowerCase();
    }
    return QuestionModel.countDocuments(query);
  }

  /**
   * Check if any published questions match the given topic & difficulty.
   */
  async hasMatchingQuestion(filter: { topic?: string; difficulty?: string }): Promise<boolean> {
    const count = await this.countMatching(filter.topic, filter.difficulty);
    return count > 0;
  }
}

export const questionRepository = new QuestionRepository();
export default questionRepository;
