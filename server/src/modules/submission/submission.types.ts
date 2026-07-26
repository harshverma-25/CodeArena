import { Document, Types } from 'mongoose';

export enum SubmissionVerdict {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
}

export interface ISubmission {
  matchId: Types.ObjectId;
  userId: Types.ObjectId;
  submissionNumber: number;
  language: string;
  sourceCode: string;
  verdict: SubmissionVerdict;
  executionTime: number; // in ms
  memoryUsed: number; // in MB
  passedTestCases: number;
  totalTestCases: number;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  isFinalAccepted: boolean;
  submittedAt: Date;
  judgedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type ISubmissionDocument = ISubmission & Document;

