export interface User {
  _id: string;
  id?: string;
  clerkId: string;
  username: string;
  displayName: string;
  avatar: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  highestWinStreak: number;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  _id: string;
  title: string;
  slug: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Draft" | "Published" | "Archived";
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: Example[];
  starterCode: Record<string, string>;
  tags: string[];
  points: number;
  timeLimit: number;
  memoryLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomPlayer {
  user: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  } | null;
  isHost: boolean;
  isReady: boolean;
}

export interface RoomSettings {
  topic: string;
  difficulty: string;
  duration: number; // in minutes
  questionCount?: number;
}

export type RoomStatusType =
  | "WAITING"
  | "READY"
  | "IN_PROGRESS"
  | "FINISHED"
  | "CANCELLED"
  | "waiting"
  | "full"
  | "starting"
  | "active"
  | "finished";

export interface Room {
  roomCode: string;
  host: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  } | null;
  players: RoomPlayer[];
  settings: RoomSettings;
  topic: string;
  difficulty: string;
  duration: number;
  questionCount?: number;
  status: RoomStatusType;
}

export interface MatchPlayer {
  user: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  } | null;
}

export type MatchStatus = "IN_PROGRESS" | "COMPLETED" | "DRAW" | "ABANDONED" | "CANCELLED";

export interface Match {
  _id: string;
  roomId: string;
  roomCode: string;
  players: MatchPlayer[];
  winner: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  } | null;
  status: MatchStatus;
  startedAt: string;
  endedAt?: string;
  duration?: number; // in seconds
  problem: Problem | null;
}

// ------------------------------
// MCQ Battle Types
// ------------------------------

export interface BattleQuestion {
  _id?: string;
  questionId: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[]; // exactly 4 options
}

export interface BattlePlayer {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  currentQuestionIndex: number;
  score: number;
  isCompleted: boolean;
}

export interface BattleInitPayload {
  battleId: string;
  roomCode: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  timePerQuestion: number;
  currentQuestionIndex: number;
  questionDeadline: string | Date | null;
  currentQuestion: BattleQuestion | null;
  players: BattlePlayer[];
}

export interface BattleNextQuestionPayload {
  currentQuestionIndex: number;
  totalQuestions: number;
  questionDeadline: string | Date | null;
  timePerQuestion: number;
  question: BattleQuestion | null;
  completed: boolean;
}

export interface BattleOpponentProgressPayload {
  userId: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  isCompleted: boolean;
  score: number;
}

export interface BattleResultsPlayer {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  score: number;
  totalQuestions: number;
  answers?: Array<{
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    timeTakenMs: number;
  }>;
}

export interface BattleResultsPayload {
  battleId: string;
  roomCode: string;
  topic: string;
  difficulty: string;
  status: string;
  winnerId: string | null;
  isDraw: boolean;
  startedAt: string | Date;
  endedAt: string | Date;
  players: BattleResultsPlayer[];
}

export interface BattleResultQuestion {
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

export interface BattleResultPlayerDetails {
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
  questions: BattleResultQuestion[];
}

export interface BattleResultDetails {
  battleId: string;
  roomCode: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  timePerQuestion: number;
  status: string;
  winnerId: string | null;
  isDraw: boolean;
  startedAt: string;
  endedAt?: string;
  duration: number; // in seconds
  players: BattleResultPlayerDetails[];
  userPlayer: BattleResultPlayerDetails;
  opponentPlayer: BattleResultPlayerDetails | null;
  result: "VICTORY" | "DEFEAT" | "DRAW" | "IN_PROGRESS" | "CANCELLED";
}

