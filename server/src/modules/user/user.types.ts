import { Document } from 'mongoose';

export interface IUser {
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
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = IUser & Document;

export interface ILeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  wins: number;
  losses: number;
  draws: number;
  battlesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
  isCurrentUser: boolean;
}

export interface ILeaderboardResponse {
  leaderboard: ILeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
  currentUserRank?: ILeaderboardEntry | null;
}

export interface IPublicUserProfile {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  preferredLanguage?: string;
  joinedAt: Date | string;
  rank: number;
  battlesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
  isCurrentUser: boolean;
  recentBattles: Array<{
    _id: string;
    roomCode: string;
    topic: string;
    difficulty: string;
    questionCount: number;
    startedAt: Date | string;
    endedAt?: Date | string;
    duration: number;
    userScore: number;
    opponentScore: number;
    result: 'VICTORY' | 'DEFEAT' | 'DRAW';
    opponent: {
      userId: string;
      username: string;
      displayName: string;
      avatar: string;
    } | null;
  }>;
}
