import { Document, Types } from 'mongoose';

export interface IRoomPlayer {
  userId: Types.ObjectId;
  isReady: boolean;
}

export interface IRoomSettings {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'random';
  duration: number; // in minutes
}

export interface IRoom {
  roomCode: string;
  hostId: Types.ObjectId;
  players: IRoomPlayer[];
  settings: IRoomSettings;
  status: 'lobby' | 'playing' | 'finished';
  matchId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type IRoomDocument = IRoom & Document;
