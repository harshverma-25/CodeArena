import { z } from 'zod';
import { languageSchema, usernameSchema } from '../../shared/validators/index.js';

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
    preferredLanguage: languageSchema.optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for GET /users/:username
export const getUserByUsernameSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    username: usernameSchema,
  }),
});

// Inferred TypeScript Types
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type GetUserByUsernameRequest = z.infer<typeof getUserByUsernameSchema>;
