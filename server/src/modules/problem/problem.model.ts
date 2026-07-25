import { Schema, model } from 'mongoose';
import { IProblemDocument } from './problem.types.js';

const ExampleSchema = new Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String },
});

const StarterCodeSchema = new Schema({
  language: { type: String, required: true },
  code: { type: String, required: true },
});

const TestCaseSchema = new Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
});

const ReferenceSolutionSchema = new Schema({
  language: { type: String, required: true },
  code: { type: String, required: true },
});

const ProblemSchema = new Schema<IProblemDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
    description: { type: String, required: true },
    inputFormat: { type: String, required: true },
    outputFormat: { type: String, required: true },
    constraints: [{ type: String }],
    examples: [ExampleSchema],
    starterCode: [StarterCodeSchema],
    hiddenTestCases: { type: [TestCaseSchema], required: true, select: false },
    referenceSolutions: { type: [ReferenceSolutionSchema], required: true, select: false },
    tags: [{ type: String }],
    timeLimit: { type: Number, required: true, default: 2000 },
    memoryLimit: { type: Number, required: true, default: 256000 },
  },
  {
    timestamps: true,
  }
);

export const ProblemModel = model<IProblemDocument>('Problem', ProblemSchema);
export default ProblemModel;
