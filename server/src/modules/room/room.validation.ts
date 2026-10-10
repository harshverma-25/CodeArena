import { z } from 'zod';
import { roomCodeSchema, topicSchema, difficultySchema } from '../../shared/validators/index.js';
import { MULTIPLAYER_TIMER_OPTIONS } from '../../shared/config/quiz-config.js';

// Allowed topic schema: QuestionTopic string, legacy topicSchema, or 'random'
const roomTopicSchema = z.string().min(1).default('random');
const roomDifficultySchema = z.enum([
  'Easy', 'Medium', 'Hard',
  'easy', 'medium', 'hard',
  'random'
]).default('random');

const roomTimeLimitSchema = z.coerce
  .number({ invalid_type_error: 'Time limit must be a number' })
  .int('Time limit must be an integer')
  .refine((val) => (MULTIPLAYER_TIMER_OPTIONS as readonly number[]).includes(val), {
    message: 'Time limit must be 10, 20, or 30 seconds',
  })
  .optional();

// Schema for POST /rooms (Create Room)
export const createRoomSchema = z.object({
  body: z.object({
    topic: roomTopicSchema.optional(),
    difficulty: roomDifficultySchema.optional(),
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
    timeLimit: roomTimeLimitSchema,
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
  body: z.object({
    topic: roomTopicSchema.optional(),
    difficulty: roomDifficultySchema.optional(),
    questionCount: z.coerce
      .number({ invalid_type_error: 'Question count must be a number' })
      .int('Question count must be an integer')
      .min(5, 'Question count must be at least 5')
      .max(30, 'Question count cannot exceed 30')
      .optional(),
    categoryId: z.string().optional(),
    subjectId: z.string().nullable().optional(),
    isMixedCategory: z.boolean().optional(),
    timeLimit: roomTimeLimitSchema,
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
