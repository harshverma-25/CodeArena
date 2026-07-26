import { Document } from 'mongoose';

export enum ProblemDifficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export enum ProblemStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
}

export enum ProblemTopic {
  ARRAYS = 'Arrays',
  STRINGS = 'Strings',
  TREES = 'Trees',
  LINKED_LISTS = 'LinkedLists',
  DYNAMIC_PROGRAMMING = 'DynamicProgramming',
  GRAPHS = 'Graphs',
  SORTING = 'Sorting',
  SEARCHING = 'Searching',
  MATH = 'Math',
  STACKS_QUEUES = 'StacksQueues',
  HEAPS = 'Heaps',
  GREEDY = 'Greedy',
  BACKTRACKING = 'Backtracking',
}

export interface IExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ITestCase {
  input: string;
  output: string;
}

export interface IProblem {
  title: string;
  slug: string;
  topic: ProblemTopic;
  difficulty: ProblemDifficulty;
  status: ProblemStatus;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string; // Markdown String
  examples: IExample[];
  starterCode: Map<string, string>; // Maps language -> code template
  hiddenTestCases: ITestCase[];
  referenceSolutions: Map<string, string>; // Maps language -> official solution
  tags: string[];
  points: number;
  timeLimit: number; // in seconds
  memoryLimit: number; // in MB
  createdAt: Date;
  updatedAt: Date;
}

export type IProblemDocument = IProblem & Document;

