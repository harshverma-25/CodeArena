import { z } from 'zod';

export const historyQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

export const battleIdParamSchema = z.object({
  params: z.object({
    battleId: z.string({ required_error: 'Battle ID is required' }),
  }),
});
