import { Schema, model } from 'mongoose';
import { IRoomDocument, RoomStatus } from './room.types.js';

const RoomPlayerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isHost: { type: Boolean, required: true, default: false },
    isReady: { type: Boolean, required: true, default: false },
  },
  { _id: false }
);

const RoomSettingsSchema = new Schema(
  {
    categoryId: { type: String, default: null },
    subjectId: { type: String, default: null },
    isMixedCategory: { type: Boolean, default: false },
    topic: { type: String, default: 'random' },
    difficulty: {
      type: String,
      required: true,
      default: 'random',
    },
    duration: { type: Number, required: true, default: 30 }, // in minutes
    questionCount: { type: Number, default: 10 },
    timeLimit: { type: Number, default: 30 },
  },
  { _id: false }
);

const RoomSchema = new Schema<IRoomDocument>(
  {
    roomCode: { type: String, required: true, unique: true, index: true },
    hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    players: { type: [RoomPlayerSchema], default: [] },
    settings: { type: RoomSettingsSchema, required: true },
    maxPlayers: { type: Number, required: true, default: 4 },
    status: {
      type: String,
      required: true,
      enum: Object.values(RoomStatus),
      default: RoomStatus.WAITING,
    },
    matchId: { type: Schema.Types.ObjectId, ref: 'Battle', default: null },
  },
  {
    timestamps: true,
  }
);

// Indexes
RoomSchema.index({ hostId: 1 });
RoomSchema.index({ status: 1 });

export const RoomModel = model<IRoomDocument>('Room', RoomSchema);
export default RoomModel;

