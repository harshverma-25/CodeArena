import { categoryRepository, CategoryRepository } from './category.repository.js';
import { ICategoryDocument, ISubjectDocument } from './category.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { questionRepository } from '../question/question.repository.js';

export class CategoryService {
  constructor(private repository: CategoryRepository = categoryRepository) {}

  /**
   * Retrieve all active categories with question counts.
   */
  async getAllCategories(): Promise<any[]> {
    const categories = await this.repository.findAllActiveCategories();
    return Promise.all(
      categories.map(async (cat) => {
        const questionCount = await questionRepository.countMatching({
          categoryId: cat.slug,
          isMixedCategory: true,
        });
        return {
          _id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          isActive: cat.isActive,
          questionCount,
        };
      })
    );
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
   * Retrieve category and all active subjects belonging to it with question counts.
   */
  async getSubjectsForCategory(categoryIdOrSlug: string): Promise<{ category: any; subjects: any[] }> {
    const category = await this.getCategory(categoryIdOrSlug);
    const subjects = await this.repository.findSubjectsByCategoryIdOrSlug(category.slug);

    const categoryQuestionCount = await questionRepository.countMatching({
      categoryId: category.slug,
      isMixedCategory: true,
    });

    const subjectsWithCount = await Promise.all(
      subjects.map(async (subj) => {
        const questionCount = await questionRepository.countMatching({
          categoryId: category.slug,
          subjectId: subj.slug,
          isMixedCategory: false,
        });
        return {
          _id: subj._id.toString(),
          categoryId: subj.categoryId.toString(),
          name: subj.name,
          slug: subj.slug,
          description: subj.description,
          icon: subj.icon,
          isActive: subj.isActive,
          questionCount,
        };
      })
    );

    return {
      category: {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        isActive: category.isActive,
        questionCount: categoryQuestionCount,
      },
      subjects: subjectsWithCount,
    };
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
}

export const categoryService = new CategoryService();
export default categoryService;
