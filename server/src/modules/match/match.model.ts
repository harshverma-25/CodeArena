import { Schema, model } from 'mongoose';
import { IMatchDocument } from './match.types.js';

const MatchPlayerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { _id: false });

const MatchSchema = new Schema<IMatchDocument>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    players: { type: [MatchPlayerSchema], required: true },
    winnerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, required: true, enum: ['active', 'completed', 'abandoned'], default: 'active' },
    startedAt: { type: Date, required: true, default: Date.now },
    endedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const MatchModel = model<IMatchDocument>('Match', MatchSchema);
export default MatchModel;
