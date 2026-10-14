import { categoryRepository, CategoryRepository } from './category.repository.js';
import { ICategoryDocument, ISubjectDocument } from './category.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { questionRepository } from '../question/question.repository.js';
import { getAvailableQuizLengths } from '../../shared/config/quiz-config.js';
import { BattleModel } from '../battle/battle.model.js';
import { BattleStatus } from '../battle/battle.types.js';

export class CategoryService {
  // In-memory bounded TTL caches for read-heavy public taxonomy & popular quizzes
  private categoriesCache: { data: any[]; expiresAt: number } | null = null;
  private subjectsCache: Map<string, { data: { category: any; subjects: any[] }; expiresAt: number }> = new Map();
  private popularCache: Map<number, { data: any[]; expiresAt: number }> = new Map();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes bounded TTL

  constructor(private repository: CategoryRepository = categoryRepository) {}

  /**
   * Explicitly evict taxonomy and popular quiz caches (called on seed, question imports, etc.).
   */
  public clearCache(): void {
    this.categoriesCache = null;
    this.subjectsCache.clear();
    this.popularCache.clear();
  }

  /**
   * Retrieve all active categories with question counts and availability metrics.
   * Employs batch question aggregation and in-memory TTL caching to eliminate N+1 queries.
   */
  async getAllCategories(): Promise<any[]> {
    const now = Date.now();
    if (this.categoriesCache && now < this.categoriesCache.expiresAt) {
      return this.categoriesCache.data;
    }

    const [categories, categoryCounts] = await Promise.all([
      this.repository.findAllActiveCategories(),
      questionRepository.countPublishedGroupedByCategory(),
    ]);

    const data = categories.map((cat) => {
      const questionCount = categoryCounts.get(cat._id.toString()) || 0;
      const availableLengths = getAvailableQuizLengths(questionCount);
      return {
        _id: cat._id.toString(),
        id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        isActive: cat.isActive,
        questionCount,
        availableLengths,
        isPlayable: questionCount >= 10,
      };
    });

    this.categoriesCache = { data, expiresAt: now + this.CACHE_TTL_MS };
    return data;
  }

  /**
   * Retrieve single category by ID or slug.
   */
  async getCategory(categoryIdOrSlug: string): Promise<ICategoryDocument> {
    const category = await this.repository.findCategoryByIdOrSlug(categoryIdOrSlug);
    if (!category) {
      throw new ApiError(404, `Category '${categoryIdOrSlug}' not found`);
    }
    return category;
  }

  /**
   * Retrieve category and all active subjects belonging to it with question counts and availability metrics.
   * Completely eliminates N+1 queries via single-pass subject question count aggregation and TTL caching.
   */
  async getSubjectsForCategory(categoryIdOrSlug: string): Promise<{ category: any; subjects: any[] }> {
    const cacheKey = categoryIdOrSlug.toLowerCase();
    const now = Date.now();
    const cached = this.subjectsCache.get(cacheKey);
    if (cached && now < cached.expiresAt) {
      return cached.data;
    }

    const category = await this.getCategory(categoryIdOrSlug);
    const [subjects, { subjectCounts, totalCategoryCount }] = await Promise.all([
      this.repository.findSubjectsByCategoryIdOrSlug(category.slug),
      questionRepository.countPublishedGroupedBySubject(category._id),
    ]);

    const categoryAvailableLengths = getAvailableQuizLengths(totalCategoryCount);

    const subjectsWithCount = subjects.map((subj) => {
      const questionCount = subjectCounts.get(subj._id.toString()) || 0;
      const availableLengths = getAvailableQuizLengths(questionCount);
      return {
        _id: subj._id.toString(),
        id: subj._id.toString(),
        categoryId: subj.categoryId.toString(),
        name: subj.name,
        slug: subj.slug,
        description: subj.description,
        icon: subj.icon,
        isActive: subj.isActive,
        questionCount,
        availableLengths,
        isPlayable: questionCount >= 10,
      };
    });

    const result = {
      category: {
        _id: category._id.toString(),
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        isActive: category.isActive,
        questionCount: totalCategoryCount,
        availableLengths: categoryAvailableLengths,
        isPlayable: totalCategoryCount >= 10,
      },
      subjects: subjectsWithCount,
    };

    this.subjectsCache.set(cacheKey, { data: result, expiresAt: now + this.CACHE_TTL_MS });
    this.subjectsCache.set(category.slug.toLowerCase(), { data: result, expiresAt: now + this.CACHE_TTL_MS });
    this.subjectsCache.set(category._id.toString(), { data: result, expiresAt: now + this.CACHE_TTL_MS });

    return result;
  }

  /**
   * Retrieve single subject by ID or slug.
   */
  async getSubject(subjectIdOrSlug: string): Promise<ISubjectDocument> {
    const subject = await this.repository.findSubjectByIdOrSlug(subjectIdOrSlug);
    if (!subject) {
      throw new ApiError(404, `Subject '${subjectIdOrSlug}' not found`);
    }
    return subject;
  }

  /**
   * Retrieve category details including live question count and playable status.
   */
  async getCategoryDetails(categoryIdOrSlug: string): Promise<any> {
    const category = await this.getCategory(categoryIdOrSlug);
    const { totalCategoryCount } = await questionRepository.countPublishedGroupedBySubject(category._id);
    const availableLengths = getAvailableQuizLengths(totalCategoryCount);
    return {
      _id: category._id.toString(),
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      isActive: category.isActive,
      questionCount: totalCategoryCount,
      availableLengths,
      isPlayable: totalCategoryCount >= 10,
    };
  }

  /**
   * Retrieve genuinely most-played quizzes from completed battles in MongoDB.
   * Employs early pipeline projection, lightweight lookup, and bounded TTL caching.
   */
  async getPopularQuizzes(limit: number = 5): Promise<any[]> {
    const now = Date.now();
    const cached = this.popularCache.get(limit);
    if (cached && now < cached.expiresAt) {
      return cached.data;
    }

    const completedBattles = await BattleModel.aggregate([
      { $match: { status: BattleStatus.COMPLETED } },
      // Project only essential fields before $lookup to avoid carrying heavy players/answers arrays in pipeline RAM
      { $project: { roomId: 1, topic: 1, endedAt: 1 } },
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                'settings.categoryId': 1,
                'settings.subjectId': 1,
                'settings.isMixedCategory': 1,
              },
            },
          ],
          as: 'room',
        },
      },
      { $unwind: { path: '$room', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: {
            categoryId: '$room.settings.categoryId',
            subjectId: '$room.settings.subjectId',
            isMixedCategory: '$room.settings.isMixedCategory',
            topic: '$topic',
          },
          count: { $sum: 1 },
          lastPlayedAt: { $max: '$endedAt' },
        },
      },
      { $sort: { count: -1, lastPlayedAt: -1 } },
    ]);

    if (!completedBattles || completedBattles.length === 0) {
      return [];
    }

    const allCategories = await this.repository.findAllActiveCategories();
    const categoryMap = new Map<string, any>();
    for (const cat of allCategories) {
      categoryMap.set(cat.slug.toLowerCase(), cat);
      categoryMap.set(cat._id.toString(), cat);
      categoryMap.set(cat.name.toLowerCase(), cat);
    }

    const allSubjects = await this.repository.findAllActiveSubjects();
    const subjectMap = new Map<string, any>();
    for (const subj of allSubjects) {
      subjectMap.set(subj.slug.toLowerCase(), subj);
      subjectMap.set(subj._id.toString(), subj);
      subjectMap.set(subj.name.toLowerCase(), subj);
    }

    const consolidatedMap = new Map<
      string,
      {
        title: string;
        description: string;
        categorySlug: string;
        subjectSlug: string | null;
        isMixedCategory: boolean;
        icon: string;
        playedCount: number;
      }
    >();

    for (const record of completedBattles) {
      const rawCat = record._id?.categoryId;
      const rawSubj = record._id?.subjectId;
      const rawTopic = record._id?.topic;
      const count = record.count || 0;

      let matchedCat: any = null;
      let matchedSubj: any = null;

      if (rawSubj) {
        matchedSubj = subjectMap.get(String(rawSubj).toLowerCase());
      }

      if (rawCat) {
        matchedCat = categoryMap.get(String(rawCat).toLowerCase());
      }

      // If no category/subject found in room settings, attempt topic resolution from legacy matches
      if (!matchedCat && !matchedSubj && rawTopic && rawTopic !== 'random') {
        const topicLower = String(rawTopic).toLowerCase();
        if (subjectMap.has(topicLower)) {
          matchedSubj = subjectMap.get(topicLower);
        } else if (categoryMap.has(topicLower)) {
          matchedCat = categoryMap.get(topicLower);
        }
      }

      if (matchedSubj) {
        if (!matchedCat) {
          matchedCat = allCategories.find(
            (c) => c._id.toString() === matchedSubj.categoryId?.toString()
          );
        }
        if (matchedCat && matchedCat.isActive && matchedSubj.isActive) {
          const key = `${matchedCat.slug}:${matchedSubj.slug}`;
          const existing = consolidatedMap.get(key);
          if (existing) {
            existing.playedCount += count;
          } else {
            consolidatedMap.set(key, {
              title: matchedSubj.name,
              description:
                matchedSubj.description ||
                `${matchedSubj.name} quiz under ${matchedCat.name}.`,
              categorySlug: matchedCat.slug,
              subjectSlug: matchedSubj.slug,
              isMixedCategory: false,
              icon: matchedSubj.icon || matchedCat.icon || 'code',
              playedCount: count,
            });
          }
        }
      } else if (matchedCat && matchedCat.isActive) {
        const key = `${matchedCat.slug}:mixed`;
        const existing = consolidatedMap.get(key);
        if (existing) {
          existing.playedCount += count;
        } else {
          consolidatedMap.set(key, {
            title: `Mixed ${matchedCat.name}`,
            description:
              matchedCat.description ||
              `Comprehensive quiz covering all topics in ${matchedCat.name}.`,
            categorySlug: matchedCat.slug,
            subjectSlug: null,
            isMixedCategory: true,
            icon: matchedCat.icon || 'brain',
            playedCount: count,
          });
        }
      }
    }

    const sorted = Array.from(consolidatedMap.values())
      .sort((a, b) => b.playedCount - a.playedCount)
      .slice(0, limit);

    const finalResults = await Promise.all(
      sorted.map(async (item, index) => {
        let questionCount = 0;
        const matchedCat = categoryMap.get(item.categorySlug.toLowerCase());
        const matchedSubj = item.subjectSlug ? subjectMap.get(item.subjectSlug.toLowerCase()) : null;

        if (matchedCat) {
          if (item.isMixedCategory || !matchedSubj) {
            const { totalCategoryCount } = await questionRepository.countPublishedGroupedBySubject(matchedCat._id);
            questionCount = totalCategoryCount;
          } else {
            const { subjectCounts } = await questionRepository.countPublishedGroupedBySubject(matchedCat._id);
            questionCount = subjectCounts.get(matchedSubj._id.toString()) || 0;
          }
        } else {
          questionCount = await questionRepository.countMatching({
            categoryId: item.categorySlug,
            subjectId: item.subjectSlug || undefined,
            isMixedCategory: item.isMixedCategory,
          });
        }

        return {
          id: `popular-${item.categorySlug}-${item.subjectSlug || 'mixed'}`,
          rank: index + 1,
          title: item.title,
          description: item.description,
          categorySlug: item.categorySlug,
          subjectSlug: item.subjectSlug,
          isMixedCategory: item.isMixedCategory,
          icon: item.icon,
          questionCount,
          playedCount: item.playedCount,
        };
      })
    );

    this.popularCache.set(limit, { data: finalResults, expiresAt: now + this.CACHE_TTL_MS });
    return finalResults;
  }
}

export const categoryService = new CategoryService();
export default categoryService;
