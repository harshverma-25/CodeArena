import { Document, Types } from 'mongoose';

export enum MatchStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DRAW = 'DRAW',
  ABANDONED = 'ABANDONED',
  CANCELLED = 'CANCELLED',
}

export interface IMatchPlayer {
  userId: Types.ObjectId;
}

export interface IMatch {
  roomId: Types.ObjectId;
  problemId: Types.ObjectId;
  players: IMatchPlayer[];
  winnerId?: Types.ObjectId | null;
  status: MatchStatus;
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

export type IMatchDocument = IMatch & Document;

