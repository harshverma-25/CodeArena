import { Schema, model } from 'mongoose';
import { IProblemDocument, ProblemDifficulty, ProblemStatus, ProblemTopic } from './problem.types.js';

const ExampleSchema = new Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String },
  },
  { _id: false }
);

const TestCaseSchema = new Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
  },
  { _id: false }
);

const ProblemSchema = new Schema<IProblemDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    topic: {
      type: String,
      required: true,
      enum: Object.values(ProblemTopic),
    },
    difficulty: {
      type: String,
      required: true,
      enum: Object.values(ProblemDifficulty),
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(ProblemStatus),
      default: ProblemStatus.DRAFT,
    },
    description: { type: String, required: true },
    inputFormat: { type: String, required: true },
    outputFormat: { type: String, required: true },
    constraints: { type: String, required: true }, // Constraints Markdown
    examples: { type: [ExampleSchema], default: [] },
    starterCode: {
      type: Map,
      of: String,
      required: true,
    },
    hiddenTestCases: {
      type: [TestCaseSchema],
      required: true,
      select: false,
    },
    referenceSolutions: {
      type: Map,
      of: String,
      required: true,
      select: false,
    },
    timeLimit: { type: Number, required: true, default: 2 }, // in seconds
    memoryLimit: { type: Number, required: true, default: 256 }, // in MB
    tags: { type: [String], default: [] },
    points: { type: Number, required: true, default: 100 },
  },
  {
    timestamps: true,
  }
);

// Indexes
ProblemSchema.index({ topic: 1 });
ProblemSchema.index({ difficulty: 1 });
ProblemSchema.index({ status: 1 });

export const ProblemModel = model<IProblemDocument>('Problem', ProblemSchema);
export default ProblemModel;

