import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    displayName: z.string().min(2).max(50).optional(),
    avatar: z.string().url().or(z.literal('')).optional(),
    preferredLanguage: z.string().min(1).optional(),
  }),
});
