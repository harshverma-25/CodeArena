import { Server, Socket } from 'socket.io';
import { roomService } from '../modules/room/room.service.js';
import { logger } from '../config/logger.js';
import { IRoomSettings } from '../modules/room/room.types.js';

/**
 * Format room details for WebSocket payloads, stripping internal database fields.
 */
export function formatRoomSocketPayload(room: any) {
  return {
    roomCode: room.roomCode,
    hostId: room.hostId && (room.hostId as any)._id ? (room.hostId as any)._id.toString() : room.hostId.toString(),
    players: room.players.map((p: any) => ({
      userId: p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString(),
      username: p.userId?.username || '',
      displayName: p.userId?.displayName || '',
      avatar: p.userId?.avatar || '',
      isHost: p.isHost,
      isReady: p.isReady,
    })),
    settings: {
      topic: room.settings.topic,
      difficulty: room.settings.difficulty,
      duration: room.settings.duration,
    },
    status: room.status,
  };
}

export function registerRoomHandlers(io: Server, socket: Socket) {
  const user = socket.data.user;
  const userId = user._id.toString();

  // Handle player joining a room channel
  socket.on('room:join', async (payload: { roomCode: string }) => {
    const roomCode = payload?.roomCode?.toUpperCase();
    if (!roomCode) {
      return socket.emit('error', { success: false, message: 'Room code is required' });
    }

    try {
      const room = await roomService.getRoom(roomCode);

      // Verify if the user is already listed as a player in this room
      const isAlreadyPlayer = room.players.some(
        (p) => p.userId && (p.userId as any)._id ? (p.userId as any)._id.toString() === userId : p.userId.toString() === userId
      );

      if (isAlreadyPlayer) {
        // Player is already in the database room; rejoin socket channel and restore state (reconnect)
        socket.join(`room:${roomCode}`);
        socket.data.roomCode = roomCode;

        // Notify other room players about reconnection
        socket.to(`room:${roomCode}`).emit('player:reconnected', { userId });

        // Push current room state to the reconnecting player
        socket.emit('room:update', formatRoomSocketPayload(room));

        logger.info(`Player ${userId} reconnected to socket room ${roomCode}`);
      } else {
        // Player is new; add to database room via RoomService
        const updatedRoom = await roomService.joinRoom(userId, roomCode);
        socket.join(`room:${roomCode}`);
        socket.data.roomCode = roomCode;

        // Broadcast updated room state to all sockets in the channel
        io.to(`room:${roomCode}`).emit('room:update', formatRoomSocketPayload(updatedRoom));

        // Notify other room players about connection
        socket.to(`room:${roomCode}`).emit('player:connected', { userId });

        logger.info(`Player ${userId} joined socket room ${roomCode}`);
      }
    } catch (error: any) {
      logger.error(error, `Failed to join room socket channel: ${roomCode}`);
      socket.emit('error', { success: false, message: error.message || 'Failed to join room' });
    }
  });

  // Handle player leaving a room channel
  socket.on('room:leave', async (payload: { roomCode: string }) => {
    const roomCode = payload?.roomCode?.toUpperCase();
    if (!roomCode) {
      return socket.emit('error', { success: false, message: 'Room code is required' });
    }

    try {
      const room = await roomService.leaveRoom(userId, roomCode);
      socket.leave(`room:${roomCode}`);
      socket.data.roomCode = undefined;

      if (room) {
        // Broadcast updated room state to the remaining players
        io.to(`room:${roomCode}`).emit('room:update', formatRoomSocketPayload(room));
      }

      logger.info(`Player ${userId} left socket room ${roomCode}`);
    } catch (error: any) {
      logger.error(error, `Failed to leave room socket channel: ${roomCode}`);
      socket.emit('error', { success: false, message: error.message || 'Failed to leave room' });
    }
  });

  // Handle player toggling ready status
  socket.on('room:ready', async (payload: { roomCode: string; isReady: boolean }) => {
    const roomCode = payload?.roomCode?.toUpperCase();
    const isReady = payload?.isReady;

    if (!roomCode || isReady === undefined) {
      return socket.emit('error', { success: false, message: 'Room code and ready status are required' });
    }

    try {
      const room = await roomService.updateReadyStatus(userId, roomCode, isReady);

      // Broadcast updated room state (including player ready state changes)
      io.to(`room:${roomCode}`).emit('room:update', formatRoomSocketPayload(room));

      logger.info(`Player ${userId} set ready to ${isReady} in room ${roomCode}`);
    } catch (error: any) {
      logger.error(error, `Failed to toggle ready status in room ${roomCode}`);
      socket.emit('error', { success: false, message: error.message || 'Failed to update ready status' });
    }
  });

  // Handle host updating room settings
  socket.on('room:update', async (payload: { roomCode: string; settings: Partial<IRoomSettings> }) => {
    const roomCode = payload?.roomCode?.toUpperCase();
    const settings = payload?.settings;

    if (!roomCode || !settings) {
      return socket.emit('error', { success: false, message: 'Room code and settings are required' });
    }

    try {
      const room = await roomService.updateSettings(userId, roomCode, settings);

      // Broadcast room settings update to everyone in the room
      io.to(`room:${roomCode}`).emit('room:update', formatRoomSocketPayload(room));

      logger.info(`Player ${userId} updated settings in room ${roomCode}`);
    } catch (error: any) {
      logger.error(error, `Failed to update room settings in room ${roomCode}`);
      socket.emit('error', { success: false, message: error.message || 'Failed to update settings' });
    }
  });

  // Handle normal socket disconnect events (e.g. tab close, connection drop)
  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    if (roomCode) {
      // Notify other room players about temporary disconnection
      socket.to(`room:${roomCode}`).emit('player:disconnected', { userId });
      logger.info(`Player ${userId} temporarily disconnected from room ${roomCode}`);
    }
  });
}
