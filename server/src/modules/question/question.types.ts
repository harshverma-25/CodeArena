import { Document, Types } from 'mongoose';

export enum QuestionTopic {
  DSA = 'DSA',
  DBMS = 'DBMS',
  OS = 'OS',
  CN = 'CN',
  OOP = 'OOP',
  JAVA = 'Java',
  CPP = 'CPP',
  JAVASCRIPT = 'JavaScript',
  SQL = 'SQL',
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export interface IQuestion {
  questionId: string;
  categoryId?: Types.ObjectId;
  subjectId?: Types.ObjectId;
  topic?: QuestionTopic | string;
  difficulty: QuestionDifficulty;
  question: string;
  options: string[]; // Exactly 4 options
  correctAnswer: number; // Index 0-3 (SERVER-SIDE ONLY)
  explanation: string; // Detailed answer breakdown (SERVER-SIDE ONLY)
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuestionDocument extends IQuestion, Document {
  _id: Types.ObjectId;
}

// Public sanitized payload returned during battles to prevent answer leakage
export interface ISanitizedQuestion {
  _id: string;
  questionId: string;
  categoryId?: string;
  subjectId?: string;
  topic?: string;
  difficulty: QuestionDifficulty;
  question: string;
  options: string[];
  isPublished: boolean;
}
