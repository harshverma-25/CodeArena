import { Types } from 'mongoose';
import { z } from 'zod';

// 1. MongoDB ObjectId Validator
export const objectIdSchema = z.string().refine(
  (val) => Types.ObjectId.isValid(val),
  {
    message: 'Invalid Mongo ObjectId',
  }
);

// 2. Pagination Validator (page & limit)
export const paginationSchema = z.object({
  page: z.coerce
    .number({ invalid_type_error: 'Page must be a number' })
    .int('Page must be an integer')
    .positive('Page must be greater than 0')
    .default(1),
  limit: z.coerce
    .number({ invalid_type_error: 'Limit must be a number' })
    .int('Limit must be an integer')
    .positive('Limit must be greater than 0')
    .max(100, 'Limit cannot exceed 100')
    .default(20),
});

// 3. Room Code Validator (6-character alphanumeric, case-insensitive helper)
export const roomCodeSchema = z
  .string()
  .min(1, 'Room code is required')
  .trim()
  .regex(/^[a-zA-Z0-9]+$/, 'Room code must be alphanumeric')
  .toUpperCase();

// 4. Username Validator
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain alphanumeric characters, underscores, and hyphens');

// 5. Programming Language Validator
export const languageSchema = z.enum(
  ['javascript', 'typescript', 'python', 'java', 'cpp', 'c++'],
  {
    errorMap: () => ({ message: 'Supported languages are: javascript, typescript, python, java, cpp, c++' }),
  }
);

// 6. Difficulty Validator
export const difficultySchema = z.enum(['Easy', 'Medium', 'Hard'], {
  errorMap: () => ({ message: "Difficulty must be one of: 'Easy', 'Medium', 'Hard'" }),
});

// 7. Topic Validator
export const topicSchema = z.enum([
  'Arrays',
  'Strings',
  'Trees',
  'LinkedLists',
  'DynamicProgramming',
  'Graphs',
  'Sorting',
  'Searching',
  'Math',
  'StacksQueues',
  'Heaps',
  'Greedy',
  'Backtracking',
], {
  errorMap: () => ({ message: 'Invalid topic' }),
});

// Inferred TypeScript Types
export type ObjectIdValidation = z.infer<typeof objectIdSchema>;
export type PaginationValidation = z.infer<typeof paginationSchema>;
export type RoomCodeValidation = z.infer<typeof roomCodeSchema>;
export type UsernameValidation = z.infer<typeof usernameSchema>;
export type LanguageValidation = z.infer<typeof languageSchema>;
export type DifficultyValidation = z.infer<typeof difficultySchema>;
export type TopicValidation = z.infer<typeof topicSchema>;
