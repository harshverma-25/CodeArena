import { z } from 'zod';
import { objectIdSchema, languageSchema } from '../../shared/validators/index.js';

// Schema for POST /submissions (Submit Code)
export const submitCodeSchema = z.object({
  body: z.object({
    matchId: objectIdSchema,
    language: languageSchema,
    sourceCode: z
      .string({ required_error: 'Source code is required' })
      .min(1, 'Source code cannot be empty'),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for GET /submissions/:submissionId
export const submissionIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    submissionId: objectIdSchema,
  }),
});

// Schema for GET /matches/:matchId/submissions
export const matchSubmissionsParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    matchId: objectIdSchema,
  }),
});

// Inferred TypeScript Types
export type SubmitCodeRequest = z.infer<typeof submitCodeSchema>;
export type SubmissionIdParamRequest = z.infer<typeof submissionIdParamSchema>;
export type MatchSubmissionsParamRequest = z.infer<typeof matchSubmissionsParamSchema>;
