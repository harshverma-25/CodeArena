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
