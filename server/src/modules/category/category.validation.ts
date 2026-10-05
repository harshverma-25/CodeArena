import { z } from 'zod';

export const categoryParamSchema = z.object({
  params: z.object({
    categoryId: z
      .string({ required_error: 'Category ID or slug is required' })
      .trim()
      .min(1, 'Category ID or slug is required')
      .max(100, 'Category ID or slug is too long')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Category ID or slug can only contain letters, numbers, underscores, and hyphens'),
  }),
});

export type CategoryParamRequest = z.infer<typeof categoryParamSchema>;
