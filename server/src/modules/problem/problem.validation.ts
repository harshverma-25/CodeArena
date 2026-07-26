import { z } from 'zod';
import { paginationSchema, topicSchema, difficultySchema } from '../../shared/validators/index.js';

// Schema for GET /problems
export const getProblemsSchema = z.object({
  body: z.object({}).optional(),
  query: paginationSchema.extend({
    topic: topicSchema.optional(),
    difficulty: difficultySchema.optional(),
    search: z.string().trim().optional(),
  }),
  params: z.object({}).optional(),
});

// Schema for GET /problems/:slug
export const getProblemBySlugSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    slug: z
      .string()
      .min(1, 'Slug is required')
      .regex(/^[a-zA-Z0-9-]+$/, 'Slug must only contain alphanumeric characters and hyphens')
      .trim(),
  }),
});

// Schema for GET /problems/random
export const getRandomProblemSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    topic: topicSchema.or(z.literal('random')).optional(),
    difficulty: difficultySchema.or(z.literal('random')).optional(),
  }),
  params: z.object({}).optional(),
});

// Inferred TypeScript Types
export type GetProblemsRequest = z.infer<typeof getProblemsSchema>;
export type GetProblemBySlugRequest = z.infer<typeof getProblemBySlugSchema>;
export type GetRandomProblemRequest = z.infer<typeof getRandomProblemSchema>;
