import { Document, Types } from 'mongoose';

export interface IImportRowError {
  row: number;
  externalId?: string;
  question?: string;
  reason: string;
}

export interface IImportHistory {
  importId: string;
  fileName: string;
  fileSize: number;
  categoryId: Types.ObjectId;
  categoryName: string;
  subjectId: Types.ObjectId;
  subjectName: string;
  adminId: Types.ObjectId;
  adminUsername: string;
  totalQuestions: number;
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  failedCount: number;
  duplicateStrategy: 'skip' | 'update';
  status: 'completed' | 'partial' | 'failed';
  validationErrors: IImportRowError[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IImportHistoryDocument extends IImportHistory, Document {}
