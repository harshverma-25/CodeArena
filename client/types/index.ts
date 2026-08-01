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
}

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
  status: "waiting" | "full" | "starting" | "active" | "finished";
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

export type SubmissionVerdict =
  | "QUEUED"
  | "RUNNING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "COMPILATION_ERROR"
  | "RUNTIME_ERROR";

export interface Submission {
  _id: string;
  matchId: string;
  userId: {
    _id: string;
    username: string;
    displayName: string;
    avatar: string;
  } | null;
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
  submittedAt: string;
  judgedAt?: string;
}
