import { roomRepository } from './room.repository.js';
import { IRoomDocument, RoomStatus, IRoomSettings } from './room.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { problemRepository } from '../problem/problem.repository.js';

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
   * Create a new private room with the authenticated user as the host.
   */
  async createRoom(
    hostUserId: string,
    settings?: Partial<IRoomSettings>
  ): Promise<IRoomDocument> {
    const topic = settings?.topic || 'random';
    const difficulty = settings?.difficulty || 'random';

    const hasProblem = await problemRepository.hasMatchingProblem({ topic, difficulty });
    if (!hasProblem) {
      const topicStr = topic === 'random' ? 'Any Topic' : topic;
      const diffStr = difficulty === 'random' ? 'Any Difficulty' : difficulty;
      throw new ApiError(
        400,
        `No published ${topicStr} / ${diffStr} problems are currently available.`
      );
    }

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
      settings: {
        topic,
        difficulty,
        duration: settings?.duration || 30,
      },
      maxPlayers: 2,
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

    const updatedSettings = {
      topic: settings.topic !== undefined ? settings.topic : room.settings.topic,
      difficulty: settings.difficulty !== undefined ? settings.difficulty : room.settings.difficulty,
      duration: settings.duration !== undefined ? settings.duration : room.settings.duration,
    };

    const hasProblem = await problemRepository.hasMatchingProblem({
      topic: updatedSettings.topic,
      difficulty: updatedSettings.difficulty,
    });
    if (!hasProblem) {
      const topicStr = updatedSettings.topic === 'random' ? 'Any Topic' : updatedSettings.topic;
      const diffStr = updatedSettings.difficulty === 'random' ? 'Any Difficulty' : updatedSettings.difficulty;
      throw new ApiError(
        400,
        `No published ${topicStr} / ${diffStr} problems are currently available.`
      );
    }

    const updated = await roomRepository.update(code, {
      settings: updatedSettings,
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

    // Update ready state
    room.players[playerIndex].isReady = isReady;

    // Transition room status to READY if all players (specifically 2 players) are ready
    const allReady = room.players.length === room.maxPlayers && room.players.every((p) => p.isReady);
    const newStatus = allReady ? RoomStatus.READY : RoomStatus.WAITING;

    const updated = await roomRepository.update(code, {
      players: room.players,
      status: newStatus,
    });

    if (!updated) {
      throw new ApiError(500, 'Failed to update ready status');
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
}

export const roomService = new RoomService();
export default roomService;
