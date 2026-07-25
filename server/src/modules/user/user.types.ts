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
