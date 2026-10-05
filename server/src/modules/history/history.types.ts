import { Types } from 'mongoose';

export interface IBattleHistoryItem {
  _id: string;
  roomId: string;
  roomCode: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  status: string;
  winnerId: string | null;
  isDraw: boolean;
  startedAt: Date | string;
  endedAt?: Date | string;
  duration: number; // in seconds
  players: Array<{
    user: {
      _id: string;
      username: string;
      displayName: string;
      avatar: string;
    } | null;
    score: number;
  }>;
  winner: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  } | null;
  opponent: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  } | null;
  userScore: number;
  opponentScore: number;
  result: 'VICTORY' | 'DEFEAT' | 'DRAW' | 'IN_PROGRESS' | 'CANCELLED';
}

export interface IBattleHistoryResponse {
  matches: IBattleHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface IBattleResultQuestion {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  selectedOption: number;
  isCorrect: boolean;
  timeTakenMs: number;
  isUnanswered: boolean;
}

export interface IBattleResultPlayer {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  isWinner: boolean;
  isDraw: boolean;
  questions: IBattleResultQuestion[];
}

export interface IBattleResultDetails {
  battleId: string;
  roomCode: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  timePerQuestion: number;
  status: string;
  winnerId: string | null;
  isDraw: boolean;
  startedAt: Date | string;
  endedAt?: Date | string;
  duration: number;
  categoryId?: string;
  subjectId?: string | null;
  isMixedCategory?: boolean;
  rankings?: any[];
  players: IBattleResultPlayer[];
  userPlayer: IBattleResultPlayer;
  opponentPlayer: IBattleResultPlayer | null;
  result: 'VICTORY' | 'DEFEAT' | 'DRAW' | 'IN_PROGRESS' | 'CANCELLED';
}
