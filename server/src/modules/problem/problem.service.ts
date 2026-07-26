import { problemRepository } from './problem.repository.js';
import { IProblemDocument } from './problem.types.js';
import { AppError } from '../../utils/app-error.js';

export class ProblemService {
  /**
   * Retrieves a paginated list of published problems, optionally filtered by topic, difficulty, and search.
   */
  async getProblems(
    filter: { topic?: string; difficulty?: string; search?: string },
    options: { page?: number; limit?: number }
  ): Promise<{ problems: IProblemDocument[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    const page = options.page || 1;
    const limit = options.limit || 20;

    const { problems, total } = await problemRepository.findAll(
      {
        topic: filter.topic,
        difficulty: filter.difficulty,
        search: filter.search,
        status: 'Published',
      },
      { page, limit }
    );

    const totalPages = Math.ceil(total / limit);

    return {
      problems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Retrieves a published problem by its slug. Throws a 404 error if not found.
   */
  async getProblemBySlug(slug: string): Promise<IProblemDocument> {
    const problem = await problemRepository.findBySlug(slug);
    
    if (!problem || problem.status !== 'Published') {
      throw new AppError('Problem not found', 404);
    }

    return problem;
  }

  /**
   * Selects a random published problem matching the given topic and difficulty.
   * Throws 404 if no matching problem is found.
   */
  async getRandomProblem(filter: { topic?: string; difficulty?: string }): Promise<IProblemDocument> {
    const problem = await problemRepository.findRandom(filter);

    if (!problem) {
      throw new AppError('No matching problem found', 404);
    }

    return problem;
  }
}

export const problemService = new ProblemService();
export default problemService;
