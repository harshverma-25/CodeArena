import { ProblemModel } from './problem.model.js';
import { IProblem, IProblemDocument } from './problem.types.js';

export class ProblemRepository {
  async findAll(
    filter: { topic?: string; difficulty?: string; status?: string; search?: string } = {},
    options: { page?: number; limit?: number } = {}
  ): Promise<{ problems: IProblemDocument[]; total: number }> {
    const query: any = {};
    if (filter.topic) query.topic = filter.topic;
    if (filter.difficulty) query.difficulty = filter.difficulty;
    if (filter.status) query.status = filter.status;
    if (filter.search) {
      query.title = { $regex: filter.search, $options: 'i' };
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [problems, total] = await Promise.all([
      ProblemModel.find(query).skip(skip).limit(limit).exec(),
      ProblemModel.countDocuments(query).exec(),
    ]);

    return { problems, total };
  }

  async findBySlug(slug: string, selectHidden: boolean = false): Promise<IProblemDocument | null> {
    if (selectHidden) {
      return ProblemModel.findOne({ slug }).select('+hiddenTestCases +referenceSolutions').exec();
    }
    return ProblemModel.findOne({ slug }).exec();
  }


  async findRandom(filter: { topic?: string; difficulty?: string } = {}): Promise<IProblemDocument | null> {
    const matchStage: any = { status: 'Published' };
    if (filter.topic && filter.topic !== 'random') {
      matchStage.topic = filter.topic;
    }
    if (filter.difficulty && filter.difficulty !== 'random') {
      matchStage.difficulty = filter.difficulty;
    }

    const result = await ProblemModel.aggregate([
      { $match: matchStage },
      { $sample: { size: 1 } },
    ]);

    if (!result || result.length === 0) return null;
    return ProblemModel.findById(result[0]._id).exec();
  }

  async hasMatchingProblem(filter: { topic?: string; difficulty?: string }): Promise<boolean> {
    const query: any = { status: 'Published' };
    if (filter.topic && filter.topic !== 'random') {
      query.topic = filter.topic;
    }
    if (filter.difficulty && filter.difficulty !== 'random') {
      query.difficulty = filter.difficulty;
    }
    const count = await ProblemModel.countDocuments(query).exec();
    return count > 0;
  }

  async getAvailability(): Promise<Array<{ _id: { topic: string; difficulty: string }; count: number }>> {
    return ProblemModel.aggregate([
      { $match: { status: 'Published' } },
      {
        $group: {
          _id: { topic: '$topic', difficulty: '$difficulty' },
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async create(problemData: Partial<IProblem>): Promise<IProblemDocument> {
    const problem = new ProblemModel(problemData);
    return problem.save();
  }
}

export const problemRepository = new ProblemRepository();
