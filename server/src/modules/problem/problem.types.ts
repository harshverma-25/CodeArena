import { Document } from 'mongoose';

export interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface IStarterCode {
  language: string;
  code: string;
}

export interface ITestCase {
  input: string;
  output: string;
}

export interface IReferenceSolution {
  language: string;
  code: string;
}

export interface IProblem {
  title: string;
  slug: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: IExample[];
  starterCode: IStarterCode[];
  hiddenTestCases: ITestCase[];
  referenceSolutions: IReferenceSolution[];
  tags: string[];
  timeLimit: number; // in ms
  memoryLimit: number; // in KB
  createdAt: Date;
  updatedAt: Date;
}

export type IProblemDocument = IProblem & Document;
