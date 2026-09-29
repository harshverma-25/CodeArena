import { Document, Types } from 'mongoose';
import { ISanitizedQuestion } from '../question/question.types.js';

export enum BattleStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IBattleAnswer {
  questionId: string;
  selectedOption: number; // 0-3 index, or -1 for timeout
  isCorrect: boolean;
  submittedAt: Date;
  timeTakenMs: number;
}

export interface IBattlePlayer {
  userId: Types.ObjectId;
  assignedQuestionIds: string[];
  currentQuestionIndex: number;
  questionDeadline: Date | null;
  answers: IBattleAnswer[];
  score: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

export interface IBattle {
  roomId: Types.ObjectId;
  roomCode: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  timePerQuestion: number; // in seconds
  players: IBattlePlayer[];
  status: BattleStatus;
  winnerId: Types.ObjectId | null;
  isDraw: boolean;
  startedAt: Date;
  endedAt?: Date;
}

export type IBattleDocument = IBattle & Document;

// Socket.IO Payload Interfaces

export interface IBattleInitPayload {
  battleId: string;
  roomCode: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  timePerQuestion: number;
  currentQuestionIndex: number;
  questionDeadline: Date | null;
  currentQuestion: ISanitizedQuestion;
  players: {
    userId: string;
    username: string;
    displayName: string;
    avatar: string;
    currentQuestionIndex: number;
    score: number;
    isCompleted: boolean;
  }[];
}

export interface IBattleNextQuestionPayload {
  currentQuestionIndex: number;
  totalQuestions: number;
  questionDeadline: Date | null;
  timePerQuestion: number;
  question: ISanitizedQuestion | null;
  completed: boolean;
}

export interface IBattleOpponentProgressPayload {
  userId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  isCompleted: boolean;
  score: number;
}

export interface IBattleResultsPayload {
  battleId: string;
  roomCode: string;
  topic: string;
  difficulty: string;
  status: BattleStatus;
  winnerId: string | null;
  isDraw: boolean;
  startedAt: Date;
  endedAt: Date;
  players: {
    userId: string;
    username: string;
    displayName: string;
    avatar: string;
    score: number;
    totalQuestions: number;
    answers: {
      questionId: string;
      selectedOption: number;
      isCorrect: boolean;
      timeTakenMs: number;
    }[];
  }[];
}
