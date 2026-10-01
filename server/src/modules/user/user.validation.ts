import { z } from 'zod';

// Schema for PATCH /users/me
export const updateUserSchema = z.object({
  body: z.object({
    displayName: z
      .string()
      .min(2, 'Display name must be at least 2 characters')
      .max(50, 'Display name cannot exceed 50 characters')
      .optional(),
    avatar: z
      .string()
      .url('Invalid avatar URL')
      .or(z.literal(''))
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for GET /users/:username
export const getUserByUsernameSchema = z.object({
  params: z.object({
    username: z.string({ required_error: 'Username parameter is required' }),
  }),
});

// Schema for GET /leaderboard or GET /users/leaderboard
export const leaderboardQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  }),
});

// Inferred TypeScript Types
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type GetUserByUsernameRequest = z.infer<typeof getUserByUsernameSchema>;
