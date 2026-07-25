import { Document, Types } from 'mongoose';

export interface IMatchPlayer {
  userId: Types.ObjectId;
}

export interface IMatch {
  roomId: Types.ObjectId;
  problemId: Types.ObjectId;
  players: IMatchPlayer[];
  winnerId?: Types.ObjectId | null;
  status: 'active' | 'completed' | 'abandoned';
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type IMatchDocument = IMatch & Document;
