import { Request, Response } from 'express';
import { roomService } from './room.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { IRoomDocument } from './room.types.js';

/**
 * Format room details for responses without exposing internal Mongoose fields.
 */
function formatRoomResponse(room: IRoomDocument) {
  return {
    roomCode: room.roomCode,
    host: room.hostId ? {
      _id: (room.hostId as any)._id || room.hostId.toString(),
      username: (room.hostId as any).username || '',
      displayName: (room.hostId as any).displayName || '',
      avatar: (room.hostId as any).avatar || '',
    } : null,
    players: room.players.map((p) => ({
      user: p.userId ? {
        _id: (p.userId as any)._id || p.userId.toString(),
        username: (p.userId as any).username || '',
        displayName: (p.userId as any).displayName || '',
        avatar: (p.userId as any).avatar || '',
      } : null,
      isHost: p.isHost,
      isReady: p.isReady,
    })),
    settings: {
      topic: room.settings.topic,
      difficulty: room.settings.difficulty,
      duration: room.settings.duration,
    },
    topic: room.settings.topic,
    difficulty: room.settings.difficulty,
    duration: room.settings.duration,
    status: room.status,
  };
}

export class RoomController {
  /**
   * POST /api/v1/rooms
   * Create a new private room.
   */
  async createRoom(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { topic, difficulty, duration } = req.body;
    const room = await roomService.createRoom(req.user._id.toString(), {
      topic,
      difficulty,
      duration,
    });

    res.status(201).json(
      new ApiResponse(201, formatRoomResponse(room), 'Room created successfully.')
    );
  }

  /**
   * POST /api/v1/rooms/join
   * Join a room using its room code.
   */
  async joinRoom(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { roomCode } = req.body;
    const room = await roomService.joinRoom(req.user._id.toString(), roomCode);

    res.status(200).json(
      new ApiResponse(200, formatRoomResponse(room), 'Successfully joined room.')
    );
  }

  /**
   * GET /api/v1/rooms/:roomCode
   * Get room details by room code.
   */
  async getRoom(req: Request, res: Response): Promise<void> {
    const { roomCode } = req.params;
    const room = await roomService.getRoom(roomCode);

    res.status(200).json(
      new ApiResponse(200, formatRoomResponse(room), 'Room details retrieved successfully.')
    );
  }

  /**
   * PATCH /api/v1/rooms/:roomCode/settings
   * Host only. Update room settings.
   */
  async updateSettings(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { roomCode } = req.params;
    const { topic, difficulty, duration } = req.body;
    const room = await roomService.updateSettings(req.user._id.toString(), roomCode, {
      topic,
      difficulty,
      duration,
    });

    res.status(200).json(
      new ApiResponse(200, formatRoomResponse(room), 'Room settings updated successfully.')
    );
  }

  /**
   * PATCH /api/v1/rooms/:roomCode/ready
   * Toggle ready status.
   */
  async updateReadyStatus(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { roomCode } = req.params;
    const { isReady } = req.body;
    const room = await roomService.updateReadyStatus(req.user._id.toString(), roomCode, isReady);

    res.status(200).json(
      new ApiResponse(200, formatRoomResponse(room), 'Ready status updated successfully.')
    );
  }

  /**
   * POST /api/v1/rooms/:roomCode/leave
   * Leave a room.
   */
  async leaveRoom(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { roomCode } = req.params;
    const room = await roomService.leaveRoom(req.user._id.toString(), roomCode);

    if (!room) {
      res.status(200).json(
        new ApiResponse(200, null, 'Left room. Room deleted because it became empty.')
      );
    } else {
      res.status(200).json(
        new ApiResponse(200, formatRoomResponse(room), 'Successfully left room.')
      );
    }
  }

  /**
   * DELETE /api/v1/rooms/:roomCode
   * Host only. Delete a room.
   */
  async deleteRoom(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User session not found');
    }

    const { roomCode } = req.params;
    await roomService.deleteRoom(req.user._id.toString(), roomCode);

    res.status(200).json(
      new ApiResponse(200, null, 'Room deleted successfully.')
    );
  }
}

export const roomController = new RoomController();
export default roomController;
