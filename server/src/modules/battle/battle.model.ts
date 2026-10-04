import { Schema, model } from 'mongoose';
import { IBattleDocument, BattleStatus } from './battle.types.js';

const BattleAnswerSchema = new Schema(
  {
    questionId: { type: String, required: true },
    selectedOption: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    submittedAt: { type: Date, required: true, default: Date.now },
    timeTakenMs: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const BattlePlayerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedQuestionIds: { type: [String], default: [] },
    currentQuestionIndex: { type: Number, default: 0 },
    questionDeadline: { type: Date, default: null },
    answers: { type: [BattleAnswerSchema], default: [] },
    score: { type: Number, default: 0 },
    status: { type: String, enum: ['IN_PROGRESS', 'COMPLETED'], default: 'IN_PROGRESS' },
  },
  { _id: false }
);

const BattleSchema = new Schema<IBattleDocument>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    roomCode: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    questionCount: { type: Number, required: true, default: 5 },
    timePerQuestion: { type: Number, required: true, default: 30 },
    players: { type: [BattlePlayerSchema], required: true },
    status: {
      type: String,
      required: true,
      enum: Object.values(BattleStatus),
      default: BattleStatus.IN_PROGRESS,
    },
    winnerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    isDraw: { type: Boolean, default: false },
    startedAt: { type: Date, required: true, default: Date.now },
    endedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for fast lookup
BattleSchema.index({ roomId: 1 });
BattleSchema.index({ roomCode: 1, status: 1 });
BattleSchema.index({ status: 1, 'players.userId': 1 });
BattleSchema.index({ 'players.userId': 1, status: 1, endedAt: -1 });

export const BattleModel = model<IBattleDocument>('Battle', BattleSchema);
export default BattleModel;
