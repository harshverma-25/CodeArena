import { Schema, model } from 'mongoose';
import { ICategoryDocument, ISubjectDocument } from './category.types.js';

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true },
    playedCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

const SubjectSchema = new Schema<ISubjectDocument>(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true, index: true },
    playedCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

SubjectSchema.index({ categoryId: 1, isActive: 1 });
SubjectSchema.index({ playedCount: -1 });

export const CategoryModel = model<ICategoryDocument>('Category', CategorySchema);
export const SubjectModel = model<ISubjectDocument>('Subject', SubjectSchema);
