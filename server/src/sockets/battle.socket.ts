import { Server, Socket } from 'socket.io';
import { battleService } from '../modules/battle/battle.service.js';
import { formatRoomSocketPayload } from './room.socket.js';
import { roomService } from '../modules/room/room.service.js';
import { logger } from '../config/logger.js';

export function registerBattleHandlers(io: Server, socket: Socket) {
  const user = socket.data.user;
  const userId = user._id.toString();

  // Host initiates battle in room
  socket.on('room:start_battle', async (payload: { roomCode: string }) => {
    const roomCode = payload?.roomCode?.toUpperCase();
    if (!roomCode) {
      return socket.emit('error', { success: false, message: 'Room code is required' });
    }

    try {
      // 1. Create and initialize battle logic on server
      const battle = await battleService.startBattle(userId, roomCode);
      const roomChannel = `room:${roomCode}`;

      // 2. Broadcast updated room status (IN_PROGRESS)
      const updatedRoom = await roomService.getRoom(roomCode);
      io.to(roomChannel).emit('room:update', formatRoomSocketPayload(updatedRoom));

      // 3. Emit battle:init payload tailored for each player (STRICT ANTI-CHEAT: only assigned Q1)
      const sockets = await io.in(roomChannel).fetchSockets();
      for (const playerSocket of sockets) {
        const pUserId = playerSocket.data.user?._id?.toString();
        if (pUserId) {
          const initPayload = await battleService.getBattleInitPayload(battle, pUserId);
          if (initPayload) {
            playerSocket.emit('battle:init', initPayload);
          }
        }
      }

      // 4. Register server-authoritative question deadline timers for both players
      for (const p of battle.players) {
        const pUserId = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
        battleService.setQuestionTimeout(
          battle._id.toString(),
          pUserId,
          0,
          battle.timePerQuestion * 1000,
          io,
          roomCode
        );
      }

      logger.info(`Battle started for room ${roomCode} (Battle ID: ${battle._id})`);
    } catch (error: any) {
      logger.error(error, `Failed to start battle for room ${roomCode}`);
      socket.emit('error', { success: false, message: error.message || 'Failed to start battle' });
    }
  });

  // Player submits answer for current question
  socket.on(
    'battle:submit_answer',
    async (payload: { roomCode: string; questionId: string; selectedOption: number }) => {
      const roomCode = payload?.roomCode?.toUpperCase();
      const { questionId, selectedOption } = payload || {};

      if (!roomCode || !questionId || selectedOption === undefined) {
        return socket.emit('error', {
          success: false,
          message: 'Room code, question ID, and selected option are required',
        });
      }

      try {
        const result = await battleService.submitAnswer(userId, roomCode, questionId, selectedOption);
        const roomChannel = `room:${roomCode}`;

        // 1. Emit next question (or completion state) to submitting player
        socket.emit('battle:next_question', result.nextQuestionPayload);

        // 2. Broadcast opponent progress update to room
        io.to(roomChannel).emit('battle:opponent_progress', result.opponentProgressPayload);

        // 3. Register timer for next question if player has remaining questions
        if (!result.isCompleted && result.battle.players[result.playerIndex]) {
          const updatedPlayer = result.battle.players[result.playerIndex];
          battleService.setQuestionTimeout(
            result.battle._id.toString(),
            userId,
            updatedPlayer.currentQuestionIndex,
            result.battle.timePerQuestion * 1000,
            io,
            roomCode
          );
        }

        // 4. If both players completed, broadcast final results payload
        if (result.resultsPayload) {
          io.to(roomChannel).emit('battle:completed', result.resultsPayload);
          logger.info(`Battle completed for room ${roomCode}`);
        }
      } catch (error: any) {
        logger.error(error, `Failed to submit battle answer for player ${userId} in room ${roomCode}`);
        socket.emit('error', { success: false, message: error.message || 'Failed to submit answer' });
      }
    }
  );
}
