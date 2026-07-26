import { Document, Types } from 'mongoose';

export enum RoomStatus {
  WAITING = 'WAITING',
  READY = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export interface IRoomPlayer {
  userId: Types.ObjectId;
  isHost: boolean;
  isReady: boolean;
}

export interface IRoomSettings {
  topic: string; // ProblemTopic or 'random'
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'random';
  duration: number; // in minutes
}

export interface IRoom {
  roomCode: string;
  hostId: Types.ObjectId;
  players: IRoomPlayer[];
  settings: IRoomSettings;
  maxPlayers: number;
  status: RoomStatus;
  matchId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type IRoomDocument = IRoom & Document;

