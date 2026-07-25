import { Schema, model } from 'mongoose';
import { ISubmissionDocument } from './submission.types.js';

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
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Pending'],
      default: 'Pending',
    },
    executionTime: { type: Number, default: 0 }, // in ms
    memoryUsed: { type: Number, default: 0 }, // in KB
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    stdout: { type: String },
    stderr: { type: String },
    compileOutput: { type: String },
    isFinalAccepted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly fetch user submissions for a specific match
SubmissionSchema.index({ matchId: 1, userId: 1 });

export const SubmissionModel = model<ISubmissionDocument>('Submission', SubmissionSchema);
export default SubmissionModel;
