import { roomRepository } from './room.repository.js';
import { RoomModel } from './room.model.js';
import { IRoomDocument, RoomStatus, IRoomSettings } from './room.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { questionRepository } from '../question/question.repository.js';
import { categoryRepository } from '../category/category.repository.js';

import {
  isValidQuestionCount,
  QUESTION_COUNT_OPTIONS,
  DEFAULT_QUESTION_COUNT,
  getCategoryTimeLimit,
} from '../../shared/config/quiz-config.js';
import { battleService } from '../battle/battle.service.js';
import { Server } from 'socket.io';

export class RoomService {
  /**
   * Generates a unique 6-character uppercase alphanumeric room code.
   */
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Validate category and subject relationships server-side.
   */
  private async validateAndResolveCategorySettings(settings?: Partial<IRoomSettings>): Promise<IRoomSettings> {
    const categoryId = settings?.categoryId;
    const subjectId = settings?.subjectId;
    const isMixedCategory = !!settings?.isMixedCategory;
    const topic = settings?.topic || 'random';
    const difficulty = settings?.difficulty || 'random';
    const duration = settings?.duration || 30;

    // 1. Question count validation (10, 15, 20)
    const rawQuestionCount = settings?.questionCount ?? DEFAULT_QUESTION_COUNT;
    if (!isValidQuestionCount(rawQuestionCount)) {
      throw new ApiError(400, `Invalid question count '${rawQuestionCount}'. Allowed options: ${QUESTION_COUNT_OPTIONS.join(', ')}`);
    }
    const questionCount = rawQuestionCount;

    let resolvedCatDoc = null;
    let resolvedSubjDoc = null;

    if (categoryId) {
      resolvedCatDoc = await categoryRepository.findCategoryByIdOrSlug(categoryId);
      if (!resolvedCatDoc) {
        throw new ApiError(404, `Category '${categoryId}' does not exist or is inactive`);
      }
    }

    if (subjectId && !isMixedCategory) {
      resolvedSubjDoc = await categoryRepository.findSubjectByIdOrSlug(subjectId);
      if (!resolvedSubjDoc) {
        throw new ApiError(404, `Subject '${subjectId}' does not exist or is inactive`);
      }

      if (resolvedCatDoc && resolvedSubjDoc.categoryId.toString() !== resolvedCatDoc._id.toString()) {
        throw new ApiError(400, `Subject '${resolvedSubjDoc.name}' does not belong to selected category '${resolvedCatDoc.name}'`);
      } else if (!resolvedCatDoc) {
        resolvedCatDoc = await categoryRepository.findCategoryByIdOrSlug(resolvedSubjDoc.categoryId.toString());
      }
    }

    // 2. Server-authoritative category timer derivation
    const catIdentifier = resolvedCatDoc ? resolvedCatDoc.slug : categoryId;
    const timeLimit = getCategoryTimeLimit(catIdentifier);

    // 3. Question availability count check against database
    const matchingCount = await questionRepository.countMatchingQuestions({
      categoryId: catIdentifier,
      subjectId: resolvedSubjDoc ? resolvedSubjDoc.slug : subjectId,
      isMixedCategory,
      topic,
    });

    if (matchingCount < questionCount) {
      const targetLabel = resolvedSubjDoc?.name
        ? `This subject (${resolvedSubjDoc.name})`
        : resolvedCatDoc?.name
        ? `This category (${resolvedCatDoc.name})`
        : 'This subject';

      if (matchingCount === 0) {
        throw new ApiError(
          400,
          `Not enough published questions: ${targetLabel} has 0 questions available. Choose another subject.`
        );
      }
      throw new ApiError(
        400,
        `Not enough published questions: ${targetLabel} has only ${matchingCount} question${matchingCount === 1 ? '' : 's'}. Choose a smaller quiz or another subject.`
      );
    }

    return {
      categoryId: catIdentifier,
      subjectId: resolvedSubjDoc ? resolvedSubjDoc.slug : subjectId,
      isMixedCategory,
      topic,
      difficulty,
      duration,
      questionCount,
      timeLimit,
    };
  }

  /**
   * Create a new private room with the authenticated user as the host.
   */
  async createRoom(
    hostUserId: string,
    settings?: Partial<IRoomSettings>
  ): Promise<IRoomDocument> {
    const validatedSettings = await this.validateAndResolveCategorySettings(settings);

    let roomCode = '';
    let isUnique = false;

    // Generate unique room code and verify it does not exist
    while (!isUnique) {
      roomCode = this.generateRoomCode();
      const existingRoom = await roomRepository.findByRoomCode(roomCode);
      if (!existingRoom) {
        isUnique = true;
      }
    }

    const room = await roomRepository.create({
      roomCode,
      hostId: hostUserId as any,
      players: [
        {
          userId: hostUserId as any,
          isHost: true,
          isReady: false,
        },
      ],
      settings: validatedSettings,
      maxPlayers: 4,
      status: RoomStatus.WAITING,
    });

    // Populate and return the room details
    const populated = await roomRepository.findByRoomCode(room.roomCode);
    if (!populated) {
      throw new ApiError(500, 'Failed to retrieve created room');
    }

    return populated;
  }

  /**
   * Create and immediately start a dedicated solo quiz session for a single player.
   */
  async createSoloQuiz(
    userId: string,
    settings?: Partial<IRoomSettings>,
    io?: Server
  ): Promise<{ room: IRoomDocument; battle: any }> {
    const validatedSettings = await this.validateAndResolveCategorySettings(settings);

    let roomCode = '';
    let isUnique = false;

    // Generate unique room code and verify it does not exist
    while (!isUnique) {
      roomCode = this.generateRoomCode();
      const existingRoom = await roomRepository.findByRoomCode(roomCode);
      if (!existingRoom) {
        isUnique = true;
      }
    }

    const room = await roomRepository.create({
      roomCode,
      hostId: userId as any,
      players: [
        {
          userId: userId as any,
          isHost: true,
          isReady: true,
        },
      ],
      settings: validatedSettings,
      maxPlayers: 1,
      status: RoomStatus.WAITING,
    });

    const populated = await roomRepository.findByRoomCode(room.roomCode);
    if (!populated) {
      throw new ApiError(500, 'Failed to retrieve created room');
    }

    // Authoritatively start battle on server (samples questions, initializes battle document, updates room to IN_PROGRESS)
    const battle = await battleService.startBattle(userId, roomCode);
    const updatedRoom = await roomRepository.findByRoomCode(roomCode);

    if (io) {
      // Set initial synchronized server round timer for Question 1
      battleService.setRoundTimeout(
        battle._id.toString(),
        0,
        battle.timePerQuestion * 1000 + 1000,
        io,
        roomCode
      );
    }

    return { room: updatedRoom || populated, battle };
  }

  /**
   * Join a room using its room code.
   */
  async joinRoom(userId: string, roomCode: string): Promise<IRoomDocument> {
    const code = roomCode.toUpperCase();
    const room = await roomRepository.findByRoomCode(code);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }

    // Reject joining if the match is already in progress or finished
    if (room.status !== RoomStatus.WAITING && room.status !== RoomStatus.READY) {
      throw new ApiError(400, 'Cannot join room after the match has started');
    }

    // Check if the user is already a player in the room
    const isAlreadyPlayer = room.players.some(
      (p) => p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() === userId : p.userId.toString() === userId
    );
    if (isAlreadyPlayer) {
      throw new ApiError(400, 'User is already in this room');
    }

    // Check if the room is full
    if (room.players.length >= room.maxPlayers) {
      throw new ApiError(409, 'Room is full');
    }

    const updated = await roomRepository.addPlayer(code, {
      userId: userId as any,
      isHost: false,
      isReady: false,
    });

    if (!updated) {
      throw new ApiError(500, 'Failed to join room');
    }

    return updated;
  }

  /**
   * Retrieve room details by room code.
   */
  async getRoom(roomCode: string): Promise<IRoomDocument> {
    const code = roomCode.toUpperCase();
    const room = await roomRepository.findByRoomCode(code);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }
    return room;
  }

  /**
   * Update room settings. Allowed only for the host before the match starts.
   */
  async updateSettings(
    userId: string,
    roomCode: string,
    settings: Partial<IRoomSettings>
  ): Promise<IRoomDocument> {
    const code = roomCode.toUpperCase();
    const room = await roomRepository.findByRoomCode(code);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }

    // Verify requester is the host
    const hostIdStr = room.hostId && (room.hostId as any)._id ? (room.hostId as any)._id.toString() : room.hostId.toString();
    if (hostIdStr !== userId) {
      throw new ApiError(403, 'Only the host can update room settings');
    }

    // Reject updates if the match has already started
    if (room.status !== RoomStatus.WAITING && room.status !== RoomStatus.READY) {
      throw new ApiError(400, 'Cannot update settings after the match has started');
    }

    const updatedSettingsCandidate = {
      categoryId: settings.categoryId !== undefined ? settings.categoryId : room.settings.categoryId,
      subjectId: settings.subjectId !== undefined ? settings.subjectId : room.settings.subjectId,
      isMixedCategory: settings.isMixedCategory !== undefined ? settings.isMixedCategory : room.settings.isMixedCategory,
      topic: settings.topic !== undefined ? settings.topic : room.settings.topic,
      difficulty: settings.difficulty !== undefined ? settings.difficulty : room.settings.difficulty,
      duration: settings.duration !== undefined ? settings.duration : room.settings.duration,
      questionCount: settings.questionCount !== undefined ? settings.questionCount : (room.settings.questionCount || 10),
    };

    const validatedSettings = await this.validateAndResolveCategorySettings(updatedSettingsCandidate);

    const updated = await roomRepository.update(code, {
      settings: validatedSettings,
    });

    if (!updated) {
      throw new ApiError(500, 'Failed to update settings');
    }

    return updated;
  }

  /**
   * Update ready status of a player.
   */
  async updateReadyStatus(
    userId: string,
    roomCode: string,
    isReady: boolean
  ): Promise<IRoomDocument> {
    const code = roomCode.toUpperCase();
    const room = await roomRepository.findByRoomCode(code);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }

    // Player must belong to the room
    const playerIndex = room.players.findIndex(
      (p) => p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() === userId : p.userId.toString() === userId
    );
    if (playerIndex === -1) {
      throw new ApiError(403, 'Player is not in this room');
    }

    // Reject toggling if the match has already started
    if (room.status !== RoomStatus.WAITING && room.status !== RoomStatus.READY) {
      throw new ApiError(400, 'Cannot change ready status after the match has started');
    }

    // Atomic update of the player's isReady status
    const playerObjId = (room.players[playerIndex].userId as any)._id || room.players[playerIndex].userId;
    const updated = await RoomModel.findOneAndUpdate(
      { roomCode: code, 'players.userId': playerObjId },
      { $set: { 'players.$.isReady': isReady } },
      { new: true }
    )
      .populate('hostId')
      .populate('players.userId')
      .exec();

    if (!updated) {
      throw new ApiError(500, 'Failed to update ready status');
    }

    // Transition room status to READY if all players are ready
    const allReady = updated.players.length === updated.maxPlayers && updated.players.every((p) => p.isReady);
    const newStatus = allReady ? RoomStatus.READY : RoomStatus.WAITING;

    if (updated.status !== newStatus) {
      updated.status = newStatus;
      await updated.save();
    }

    return updated;
  }

  /**
   * Leave a room.
   */
  async leaveRoom(userId: string, roomCode: string): Promise<IRoomDocument | null> {
    const code = roomCode.toUpperCase();
    const room = await roomRepository.findByRoomCode(code);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }

    // Player must belong to the room
    const playerIndex = room.players.findIndex(
      (p) => p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() === userId : p.userId.toString() === userId
    );
    if (playerIndex === -1) {
      throw new ApiError(403, 'Player is not in this room');
    }

    // Reject leaving if the match has already started
    if (room.status !== RoomStatus.WAITING && room.status !== RoomStatus.READY) {
      throw new ApiError(400, 'Cannot leave room after the match has started');
    }

    // Remove player from array
    room.players.splice(playerIndex, 1);

    // If room becomes empty, delete it
    if (room.players.length === 0) {
      await roomRepository.delete(code);
      return null;
    }

    // If host leaves, transfer host ownership to the remaining player
    let newHostId = room.hostId;
    const wasHost = room.hostId && (room.hostId as any)._id ? (room.hostId as any)._id.toString() === userId : room.hostId.toString() === userId;

    if (wasHost) {
      const remainingPlayer = room.players[0];
      remainingPlayer.isHost = true;
      newHostId = remainingPlayer.userId && (remainingPlayer.userId as any)._id ? (remainingPlayer.userId as any)._id : remainingPlayer.userId;
    }

    // Since a player left, revert status to WAITING
    const updated = await roomRepository.update(code, {
      players: room.players,
      hostId: newHostId,
      status: RoomStatus.WAITING,
    });

    return updated;
  }

  /**
   * Delete a room. Host only, before match starts.
   */
  async deleteRoom(userId: string, roomCode: string): Promise<void> {
    const code = roomCode.toUpperCase();
    const room = await roomRepository.findByRoomCode(code);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }

    // Verify host
    const hostIdStr = room.hostId && (room.hostId as any)._id ? (room.hostId as any)._id.toString() : room.hostId.toString();
    if (hostIdStr !== userId) {
      throw new ApiError(403, 'Only the host can delete the room');
    }

    // Verify before match starts
    if (room.status !== RoomStatus.WAITING && room.status !== RoomStatus.READY) {
      throw new ApiError(400, 'Cannot delete room after the match has started');
    }

    await roomRepository.delete(code);
  }

  private rematchCache = new Map<string, { roomCode: string; createdAt: number }>();
  private inFlightRematch = new Map<string, Promise<IRoomDocument>>();

  /**
   * Create a rematch room from a finished quiz session.
   * Preserves quiz configuration (category, subject, mixed mode, question count, timer),
   * identifies authoritative host, and broadcasts to active participants.
   */
  async createRematchRoom(
    userId: string,
    oldRoomCode: string,
    io?: any
  ): Promise<IRoomDocument> {
    const code = oldRoomCode.toUpperCase();

    // Check in-flight rematch creation for concurrent calls
    const inFlight = this.inFlightRematch.get(code);
    if (inFlight) {
      return inFlight;
    }

    const execution = this.executeCreateRematchRoom(userId, code, io);
    this.inFlightRematch.set(code, execution);
    try {
      return await execution;
    } finally {
      this.inFlightRematch.delete(code);
    }
  }

  private async executeCreateRematchRoom(
    userId: string,
    code: string,
    io?: any
  ): Promise<IRoomDocument> {
    const oldRoom = await roomRepository.findByRoomCode(code);
    if (!oldRoom) {
      throw new ApiError(404, 'Room not found');
    }

    // 1. Participant Authorization: Requester must be part of the room
    const isParticipant = oldRoom.players.some((p) => {
      const pId = p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
      return pId === userId;
    });
    if (!isParticipant) {
      throw new ApiError(403, 'Only participants in this quiz can initiate a rematch');
    }

    // 2. Room State Validation: Match must be finished (or waiting in solo)
    if (oldRoom.status !== RoomStatus.FINISHED && oldRoom.status !== RoomStatus.WAITING) {
      throw new ApiError(400, 'Cannot initiate a rematch while the current match is still active');
    }

    // 3. Idempotency Check: Prevent duplicate room creation within 60s
    const cached = this.rematchCache.get(code);
    if (cached && Date.now() - cached.createdAt < 60000) {
      const existingRematch = await roomRepository.findByRoomCode(cached.roomCode);
      if (existingRematch && existingRematch.status === RoomStatus.WAITING) {
        if (io) {
          io.to(`room:${code}`).emit('room:play_again', {
            oldRoomCode: code,
            newRoomCode: existingRematch.roomCode,
          });
        }
        return existingRematch;
      }
    }

    // 4. Host determination:
    const oldHostIdStr = oldRoom.hostId && (oldRoom.hostId as any)._id
      ? (oldRoom.hostId as any)._id.toString()
      : oldRoom.hostId.toString();

    let newHostIdStr = oldHostIdStr;

    // Check if original host is active in socket channel if io is present
    if (io && userId !== oldHostIdStr) {
      try {
        const sockets = await io.in(`room:${code}`).fetchSockets();
        const isOldHostActive = sockets.some(
          (s: any) => s.data?.user?._id?.toString() === oldHostIdStr
        );
        // If original host is no longer active/present, migrate host to requester
        if (!isOldHostActive) {
          newHostIdStr = userId;
        }
      } catch {
        // Fallback to preserving old host if socket inspect fails
      }
    }

    // 5. Inherit previous quiz settings
    const inheritedSettings = {
      categoryId: oldRoom.settings?.categoryId,
      subjectId: oldRoom.settings?.subjectId,
      isMixedCategory: oldRoom.settings?.isMixedCategory,
      topic: oldRoom.settings?.topic || 'random',
      difficulty: oldRoom.settings?.difficulty || 'random',
      duration: oldRoom.settings?.duration || 30,
      questionCount: oldRoom.settings?.questionCount || 10,
    };

    const validatedSettings = await this.validateAndResolveCategorySettings(inheritedSettings);

    // 6. Generate unique new room code
    let newRoomCode = '';
    let isUnique = false;
    while (!isUnique) {
      newRoomCode = this.generateRoomCode();
      const existing = await roomRepository.findByRoomCode(newRoomCode);
      if (!existing) {
        isUnique = true;
      }
    }

    // 7. Initial players: Host, and if requester is different from host, include requester
    const initialPlayers: Array<{ userId: any; isHost: boolean; isReady: boolean }> = [
      {
        userId: newHostIdStr as any,
        isHost: true,
        isReady: false,
      },
    ];

    if (userId !== newHostIdStr) {
      initialPlayers.push({
        userId: userId as any,
        isHost: false,
        isReady: false,
      });
    }

    // 8. Create new room in MongoDB
    await roomRepository.create({
      roomCode: newRoomCode,
      hostId: newHostIdStr as any,
      players: initialPlayers,
      settings: validatedSettings,
      maxPlayers: oldRoom.maxPlayers || 4,
      status: RoomStatus.WAITING,
    });

    const populated = await roomRepository.findByRoomCode(newRoomCode);
    if (!populated) {
      throw new ApiError(500, 'Failed to create rematch room');
    }

    // Cache the rematch room code for idempotency
    this.rematchCache.set(code, { roomCode: newRoomCode, createdAt: Date.now() });

    // Broadcast rematch event to all participants listening in old room channel
    if (io) {
      io.to(`room:${code}`).emit('room:play_again', {
        oldRoomCode: code,
        newRoomCode,
      });
    }

    return populated;
  }
}

export const roomService = new RoomService();
export default roomService;
