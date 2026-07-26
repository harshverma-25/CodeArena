import { Schema, model } from 'mongoose';
import { IMatchDocument, MatchStatus } from './match.types.js';

const MatchPlayerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { _id: false }
);

const MatchSchema = new Schema<IMatchDocument>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
    players: { type: [MatchPlayerSchema], required: true },
    winnerId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      required: true,
      enum: Object.values(MatchStatus),
      default: MatchStatus.IN_PROGRESS,
    },
    startedAt: { type: Date, required: true, default: Date.now },
    endedAt: { type: Date },
    duration: { type: Number }, // in seconds
  },
  {
    timestamps: true,
  }
);

// Indexes
MatchSchema.index({ roomId: 1 });
MatchSchema.index({ problemId: 1 });
MatchSchema.index({ winnerId: 1 });
MatchSchema.index({ startedAt: 1 });

export const MatchModel = model<IMatchDocument>('Match', MatchSchema);
export default MatchModel;

