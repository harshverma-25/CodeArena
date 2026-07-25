import { Document, Types } from 'mongoose';

export interface ISubmission {
  matchId: Types.ObjectId;
  userId: Types.ObjectId;
  submissionNumber: number;
  language: string;
  sourceCode: string;
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error' | 'Compilation Error' | 'Pending';
  executionTime: number; // in ms
  memoryUsed: number; // in KB
  passedTestCases: number;
  totalTestCases: number;
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  isFinalAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ISubmissionDocument = ISubmission & Document;
