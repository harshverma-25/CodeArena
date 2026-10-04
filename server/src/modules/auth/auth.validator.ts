import { z } from 'zod';

export const createGuestSessionSchema = z.object({
  body: z
    .object({
      displayName: z
        .string()
        .trim()
        .min(2, 'Display name must be at least 2 characters')
        .max(25, 'Display name must not exceed 25 characters')
        .regex(
          /^[a-zA-Z0-9 _-]+$/,
          'Display name can only contain letters, numbers, spaces, underscores, and hyphens'
        )
        .optional(),
    })
    .optional(),
});

export type CreateGuestSessionInput = z.infer<typeof createGuestSessionSchema>;
