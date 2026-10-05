import { Document, Types } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryDocument extends ICategory, Document {
  _id: Types.ObjectId;
}

export interface ISubject {
  categoryId: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubjectDocument extends ISubject, Document {
  _id: Types.ObjectId;
}
