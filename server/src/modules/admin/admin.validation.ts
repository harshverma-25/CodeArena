import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
    description: z.string().max(250).optional(),
    icon: z.string().max(50).optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    description: z.string().max(250).optional(),
    icon: z.string().max(50).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createSubjectSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, 'Category ID is required'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(60),
    slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
    description: z.string().max(250).optional(),
    icon: z.string().max(50).optional(),
  }),
});

export const updateSubjectSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(2).max(60).optional(),
    description: z.string().max(250).optional(),
    icon: z.string().max(50).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const rawQuestionItemSchema = z.object({
  externalId: z.string().optional(),
  questionId: z.string().optional(),
  question: z.string().min(1, 'Question text is required'),
  options: z.array(z.string()).min(4, 'Must provide 4 options').max(4, 'Must provide 4 options'),
  correctAnswer: z.union([
    z.number().int().min(0).max(3),
    z.string().regex(/^[0-3]$|^[A-Da-d]$/, 'Correct answer must be 0-3 or A-D'),
  ]),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  explanation: z.string().optional().default(''),
});

export const previewImportSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, 'Category is required'),
    subjectId: z.string().min(1, 'Subject is required'),
    fileName: z.string().min(1, 'File name is required'),
    fileSize: z.number().nonnegative().optional().default(0),
    questions: z.array(z.any()).min(1, 'Questions array must contain at least 1 question'),
  }),
});

export const executeImportSchema = z.object({
  body: z.object({
    categoryId: z.string().min(1, 'Category is required'),
    subjectId: z.string().min(1, 'Subject is required'),
    fileName: z.string().min(1, 'File name is required'),
    fileSize: z.number().nonnegative().optional().default(0),
    duplicateStrategy: z.enum(['skip', 'update']).default('skip'),
    questions: z.array(z.any()).min(1, 'Questions array must contain at least 1 question'),
  }),
});

export const listImportHistorySchema = z.object({
  query: z.object({
    page: z.union([z.string().regex(/^\d+$/).transform(Number), z.number()]).optional().default(1),
    limit: z.union([z.string().regex(/^\d+$/).transform(Number), z.number()]).optional().default(10),
    status: z.enum(['completed', 'partial', 'failed']).optional(),
    search: z.string().optional(),
  }),
});
