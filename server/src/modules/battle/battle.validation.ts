import { z } from 'zod';
import { roomCodeSchema } from '../../shared/validators/index.js';

// Schema for POST /battles/start
export const startBattleSchema = z.object({
  body: z.object({
    roomCode: roomCodeSchema,
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type StartBattleRequest = z.infer<typeof startBattleSchema>;
