import { Schema, model } from 'mongoose';
import { IRoomDocument } from './room.types.js';

const RoomPlayerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isReady: { type: Boolean, default: false },
}, { _id: false });

const RoomSettingsSchema = new Schema({
  topic: { type: String, required: true, default: 'random' },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard', 'random'], default: 'random' },
  duration: { type: Number, required: true, default: 30 }, // in minutes
}, { _id: false });

const RoomSchema = new Schema<IRoomDocument>(
  {
    roomCode: { type: String, required: true, unique: true, index: true },
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    players: { type: [RoomPlayerSchema], default: [] },
    settings: { type: RoomSettingsSchema, required: true },
    status: { type: String, required: true, enum: ['lobby', 'playing', 'finished'], default: 'lobby' },
    matchId: { type: Schema.Types.ObjectId, ref: 'Match' },
  },
  {
    timestamps: true,
  }
);

export const RoomModel = model<IRoomDocument>('Room', RoomSchema);
export default RoomModel;
