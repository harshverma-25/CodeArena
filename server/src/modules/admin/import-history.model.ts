import { Schema, model } from 'mongoose';
import { IImportHistoryDocument } from './import-history.types.js';

const ImportRowErrorSchema = new Schema(
  {
    row: { type: Number, required: true },
    externalId: { type: String, default: '' },
    question: { type: String, default: '' },
    reason: { type: String, required: true },
  },
  { _id: false }
);

const ImportHistorySchema = new Schema<IImportHistoryDocument>(
  {
    importId: { type: String, required: true, unique: true, index: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    categoryName: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    subjectName: { type: String, required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    adminUsername: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    importedCount: { type: Number, default: 0 },
    updatedCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    duplicateStrategy: { type: String, enum: ['skip', 'update'], default: 'skip' },
    status: { type: String, enum: ['completed', 'partial', 'failed'], default: 'completed', index: true },
    validationErrors: { type: [ImportRowErrorSchema], default: [] },
  },
  { timestamps: true }
);

ImportHistorySchema.index({ createdAt: -1 });

export const ImportHistoryModel = model<IImportHistoryDocument>('ImportHistory', ImportHistorySchema);
export default ImportHistoryModel;
