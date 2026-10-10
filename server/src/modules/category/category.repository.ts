import { CategoryModel, SubjectModel } from './category.model.js';
import { ICategoryDocument, ISubjectDocument } from './category.types.js';
import { Types } from 'mongoose';

export class CategoryRepository {
  /**
   * Find all active categories sorted by name.
   */
  async findAllActiveCategories(): Promise<ICategoryDocument[]> {
    return CategoryModel.find({ isActive: true }).sort({ name: 1 });
  }

  /**
   * Find category by ObjectId string or unique slug.
   */
  async findCategoryByIdOrSlug(idOrSlug: string): Promise<ICategoryDocument | null> {
    if (!idOrSlug) return null;
    if (Types.ObjectId.isValid(idOrSlug)) {
      const byId = await CategoryModel.findOne({ _id: idOrSlug, isActive: true });
      if (byId) return byId;
    }
    return CategoryModel.findOne({ slug: idOrSlug.toLowerCase(), isActive: true });
  }

  /**
   * Find all active subjects belonging to a category (specified by category ObjectId or slug).
   */
  async findSubjectsByCategoryIdOrSlug(categoryIdOrSlug: string): Promise<ISubjectDocument[]> {
    const category = await this.findCategoryByIdOrSlug(categoryIdOrSlug);
    if (!category) return [];
    return SubjectModel.find({ categoryId: category._id, isActive: true }).sort({ name: 1 });
  }

  /**
   * Find subject by ObjectId string or unique slug.
   */
  async findSubjectByIdOrSlug(idOrSlug: string): Promise<ISubjectDocument | null> {
    if (!idOrSlug) return null;
    if (Types.ObjectId.isValid(idOrSlug)) {
      const byId = await SubjectModel.findOne({ _id: idOrSlug, isActive: true });
      if (byId) return byId;
    }
    return SubjectModel.findOne({ slug: idOrSlug.toLowerCase(), isActive: true });
  }

  /**
   * Upsert a category record by slug for idempotent seeding.
   */
  async upsertCategory(data: { name: string; slug: string; description?: string; icon?: string; isActive?: boolean }): Promise<ICategoryDocument> {
    return CategoryModel.findOneAndUpdate(
      { slug: data.slug.toLowerCase() },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  }

  /**
   * Upsert a subject record by slug for idempotent seeding.
   */
  async upsertSubject(data: { categoryId: Types.ObjectId; name: string; slug: string; description?: string; icon?: string; isActive?: boolean }): Promise<ISubjectDocument> {
    return SubjectModel.findOneAndUpdate(
      { slug: data.slug.toLowerCase() },
      { $set: data },
      { new: true, upsert: true, runValidators: true }
    );
  }

  /**
   * Find all active subjects across all categories.
   */
  async findAllActiveSubjects(): Promise<ISubjectDocument[]> {
    return SubjectModel.find({ isActive: true }).sort({ name: 1 });
  }
}

export const categoryRepository = new CategoryRepository();
export default categoryRepository;
