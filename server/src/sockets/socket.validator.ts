import { z } from 'zod';

export const roomCodeSchema = z
  .string({ required_error: 'Room code is required' })
  .trim()
  .length(6, 'Room code must be exactly 6 characters')
  .regex(/^[A-Za-z0-9]{6}$/, 'Room code must contain only alphanumeric characters')
  .transform((val) => val.toUpperCase());

export const roomJoinPayloadSchema = z.object({
  roomCode: roomCodeSchema,
});

export const roomReadyPayloadSchema = z.object({
  roomCode: roomCodeSchema,
  isReady: z.boolean({ required_error: 'isReady flag is required' }),
});

export const roomUpdateSettingsPayloadSchema = z.object({
  roomCode: roomCodeSchema,
  settings: z.object({
    topic: z.string().trim().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard', 'random']).optional(),
    questionCount: z.union([z.literal(10), z.literal(15), z.literal(20)]).optional(),
    categoryId: z.string().trim().optional(),
    subjectId: z.string().trim().optional(),
    isMixedCategory: z.boolean().optional(),
    timeLimit: z.number().positive().optional(),
  }),
});

export const roomPlayAgainPayloadSchema = z.object({
  roomCode: roomCodeSchema,
});

export const roomLeavePayloadSchema = z.object({
  roomCode: roomCodeSchema,
});

export const roomStartBattlePayloadSchema = z.object({
  roomCode: roomCodeSchema,
});

export const battleSubmitAnswerPayloadSchema = z.object({
  roomCode: roomCodeSchema,
  questionId: z.string().min(1, 'Question ID is required'),
  selectedOption: z.number().int().min(0).max(3, 'Option must be an index from 0 to 3'),
});

export const battleAdvanceRoundPayloadSchema = z.object({
  roomCode: roomCodeSchema,
});

export const battleReconnectPayloadSchema = z.object({
  roomCode: roomCodeSchema,
});
