import { z } from 'zod';
import { roomCodeSchema, objectIdSchema, paginationSchema } from '../../shared/validators/index.js';

// Schema for POST /matches/start
export const startMatchSchema = z.object({
  body: z.object({
    roomCode: roomCodeSchema,
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for GET /matches/:matchId
export const matchIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    matchId: objectIdSchema,
  }),
});

// Schema for GET /matches/history
export const matchHistorySchema = z.object({
  body: z.object({}).optional(),
  query: paginationSchema,
  params: z.object({}).optional(),
});

// Inferred TypeScript Types
export type StartMatchRequest = z.infer<typeof startMatchSchema>;
export type MatchIdParamRequest = z.infer<typeof matchIdParamSchema>;
export type MatchHistoryRequest = z.infer<typeof matchHistorySchema>;
