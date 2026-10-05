import { z } from 'zod';
import { roomCodeSchema, topicSchema, difficultySchema } from '../../shared/validators/index.js';

// Allowed topic schema: QuestionTopic string, legacy topicSchema, or 'random'
const roomTopicSchema = z.string().min(1).default('random');
const roomDifficultySchema = z.enum([
  'Easy', 'Medium', 'Hard',
  'easy', 'medium', 'hard',
  'random'
]).default('random');

// Schema for POST /rooms (Create Room)
export const createRoomSchema = z.object({
  body: z
    .object({
      topic: roomTopicSchema.optional(),
      difficulty: roomDifficultySchema.optional(),
      duration: z.coerce
        .number({ invalid_type_error: 'Duration must be a number' })
        .int('Duration must be an integer')
        .positive('Duration must be positive')
        .min(5, 'Duration must be at least 5 minutes')
        .max(180, 'Duration cannot exceed 180 minutes')
        .default(30)
        .optional(),
      questionCount: z.coerce
        .number({ invalid_type_error: 'Question count must be a number' })
        .int('Question count must be an integer')
        .min(5, 'Question count must be at least 5')
        .max(30, 'Question count cannot exceed 30')
        .default(10)
        .optional(),
      categoryId: z.string().optional(),
      subjectId: z.string().nullable().optional(),
      isMixedCategory: z.boolean().optional(),
    })
    .refine((data) => !('timeLimit' in data), {
      message: 'Arbitrary timeLimit cannot be set by client',
    }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for POST /rooms/join (Join Room)
export const joinRoomSchema = z.object({
  body: z.object({
    roomCode: roomCodeSchema,
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for routes with only :roomCode in params (GET, POST leave, DELETE)
export const roomCodeParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    roomCode: roomCodeSchema,
  }),
});

// Schema for PATCH /rooms/:roomCode/settings (Update Settings)
export const updateSettingsSchema = z.object({
  body: z
    .object({
      topic: roomTopicSchema.optional(),
      difficulty: roomDifficultySchema.optional(),
      duration: z.coerce
        .number({ invalid_type_error: 'Duration must be a number' })
        .int('Duration must be an integer')
        .positive('Duration must be positive')
        .min(5, 'Duration must be at least 5 minutes')
        .max(180, 'Duration cannot exceed 180 minutes')
        .optional(),
      questionCount: z.coerce
        .number({ invalid_type_error: 'Question count must be a number' })
        .int('Question count must be an integer')
        .min(5, 'Question count must be at least 5')
        .max(30, 'Question count cannot exceed 30')
        .optional(),
      categoryId: z.string().optional(),
      subjectId: z.string().nullable().optional(),
      isMixedCategory: z.boolean().optional(),
    })
    .refine((data) => !('timeLimit' in data), {
      message: 'Arbitrary timeLimit cannot be set by client',
    }),
  query: z.object({}).optional(),
  params: z.object({
    roomCode: roomCodeSchema,
  }),
});

// Schema for PATCH /rooms/:roomCode/ready (Update Ready Status)
export const updateReadyStatusSchema = z.object({
  body: z.object({
    isReady: z.boolean({ required_error: 'isReady is required' }),
  }),
  query: z.object({}).optional(),
  params: z.object({
    roomCode: roomCodeSchema,
  }),
});

// Inferred TypeScript Types
export type CreateRoomRequest = z.infer<typeof createRoomSchema>;
export type JoinRoomRequest = z.infer<typeof joinRoomSchema>;
export type RoomCodeParamRequest = z.infer<typeof roomCodeParamSchema>;
export type UpdateSettingsRequest = z.infer<typeof updateSettingsSchema>;
export type UpdateReadyStatusRequest = z.infer<typeof updateReadyStatusSchema>;
