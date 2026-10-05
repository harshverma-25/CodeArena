import { categoryRepository, CategoryRepository } from './category.repository.js';
import { ICategoryDocument, ISubjectDocument } from './category.types.js';
import { ApiError } from '../../shared/errors/api-error.js';

export class CategoryService {
  constructor(private repository: CategoryRepository = categoryRepository) {}

  /**
   * Retrieve all active categories.
   */
  async getAllCategories(): Promise<ICategoryDocument[]> {
    return this.repository.findAllActiveCategories();
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
   * Retrieve category and all active subjects belonging to it.
   */
  async getSubjectsForCategory(categoryIdOrSlug: string): Promise<{ category: ICategoryDocument; subjects: ISubjectDocument[] }> {
    const category = await this.getCategory(categoryIdOrSlug);
    const subjects = await this.repository.findSubjectsByCategoryIdOrSlug(category.slug);
    return { category, subjects };
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
