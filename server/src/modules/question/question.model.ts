import { Schema, model } from 'mongoose';
import { IQuestionDocument, QuestionTopic, QuestionDifficulty } from './question.types.js';

const QuestionSchema = new Schema<IQuestionDocument>(
  {
    questionId: { type: String, required: true, unique: true, index: true },
    topic: {
      type: String,
      required: true,
      enum: Object.values(QuestionTopic),
      index: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: Object.values(QuestionDifficulty),
      index: true,
    },
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => Array.isArray(val) && val.length === 4,
        'Question must have exactly 4 options',
      ],
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    explanation: { type: String, required: true },
    isPublished: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

// Compound Index for efficient random selection & filtered pagination
QuestionSchema.index({ topic: 1, difficulty: 1, isPublished: 1 });

export const QuestionModel = model<IQuestionDocument>('Question', QuestionSchema);
export default QuestionModel;
