import { z } from 'zod';
import { QuestionTopic, QuestionDifficulty } from './question.types.js';

export const listQuestionsSchema = z.object({
  query: z.object({
    topic: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard', 'all']).optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

export const getQuestionParamSchema = z.object({
  params: z.object({
    questionId: z.string().min(1, 'Question ID is required'),
  }),
});
