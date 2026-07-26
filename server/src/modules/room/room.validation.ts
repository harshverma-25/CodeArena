import { z } from 'zod';
import { roomCodeSchema, topicSchema, difficultySchema } from '../../shared/validators/index.js';

// Schema for POST /rooms (Create Room)
export const createRoomSchema = z.object({
  body: z.object({
    topic: topicSchema.or(z.literal('random')).default('random'),
    difficulty: difficultySchema.or(z.literal('random')).default('random'),
    duration: z.coerce
      .number({ invalid_type_error: 'Duration must be a number' })
      .int('Duration must be an integer')
      .positive('Duration must be positive')
      .min(5, 'Duration must be at least 5 minutes')
      .max(180, 'Duration cannot exceed 180 minutes')
      .default(30),
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
    topic: topicSchema.or(z.literal('random')).optional(),
    difficulty: difficultySchema.or(z.literal('random')).optional(),
    duration: z.coerce
      .number({ invalid_type_error: 'Duration must be a number' })
      .int('Duration must be an integer')
      .positive('Duration must be positive')
      .min(5, 'Duration must be at least 5 minutes')
      .max(180, 'Duration cannot exceed 180 minutes')
      .optional(),
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
