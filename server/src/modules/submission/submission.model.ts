import { Schema, model } from 'mongoose';
import { ISubmissionDocument, SubmissionVerdict } from './submission.types.js';

const SubmissionSchema = new Schema<ISubmissionDocument>(
  {
    matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    submissionNumber: { type: Number, required: true },
    language: { type: String, required: true },
    sourceCode: { type: String, required: true },
    verdict: {
      type: String,
      required: true,
      enum: Object.values(SubmissionVerdict),
      default: SubmissionVerdict.QUEUED,
      index: true,
    },
    executionTime: { type: Number, default: 0 }, // in ms
    memoryUsed: { type: Number, default: 0 }, // in MB
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    stdout: { type: String },
    stderr: { type: String },
    compileOutput: { type: String },
    isFinalAccepted: { type: Boolean, default: false },
    submittedAt: { type: Date, required: true, default: Date.now, index: true },
    judgedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch user submissions for a specific match
SubmissionSchema.index({ matchId: 1, userId: 1 });

export const SubmissionModel = model<ISubmissionDocument>('Submission', SubmissionSchema);
export default SubmissionModel;

