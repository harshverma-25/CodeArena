import { Server, Socket } from 'socket.io';
import { battleService } from '../modules/battle/battle.service.js';
import { formatRoomSocketPayload } from './room.socket.js';
import { roomService } from '../modules/room/room.service.js';
import { logger } from '../config/logger.js';
import { socketRateLimiter } from './socket.limiter.js';
import {
  roomStartBattlePayloadSchema,
  battleSubmitAnswerPayloadSchema,
  battleAdvanceRoundPayloadSchema,
  battleReconnectPayloadSchema,
} from './socket.validator.js';

export function registerBattleHandlers(io: Server, socket: Socket) {
  const user = socket.data.user;
  const userId = user._id.toString();

  // Host initiates battle in room
  socket.on('room:start_battle', async (payload: { roomCode: string }) => {
    if (socketRateLimiter.isEventRateLimited(socket.id, 'room:start_battle', 3)) {
      return socket.emit('error', { success: false, message: 'Too many requests. Please wait a moment.' });
    }

    const parsed = roomStartBattlePayloadSchema.safeParse(payload);
    if (!parsed.success) {
      return socket.emit('error', { success: false, message: parsed.error.issues[0].message });
    }
    const roomCode = parsed.data.roomCode;

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
      // Rate limit answer submissions to 3 per second to prevent connection spam
      if (socketRateLimiter.isEventRateLimited(socket.id, 'battle:submit_answer', 3)) {
        return socket.emit('error', { success: false, message: 'Too many submissions. Please slow down.' });
      }

      const parsed = battleSubmitAnswerPayloadSchema.safeParse(payload);
      if (!parsed.success) {
        return socket.emit('error', {
          success: false,
          message: parsed.error.issues[0].message,
        });
      }
      const { roomCode, questionId, selectedOption } = parsed.data;

      try {
        const result = await battleService.submitAnswer(userId, roomCode, questionId, selectedOption, io);

        // Acknowledge answer locking with frozen potential score
        socket.emit('battle:answer_locked', {
          selectedOption,
          potentialScore: result.potentialScore,
          timeTakenMs: result.timeTakenMs,
        });
      } catch (error: any) {
        logger.error(error, `Failed to submit battle answer for player ${userId} in room ${roomCode}`);
        socket.emit('error', { success: false, message: error.message || 'Failed to submit answer' });
      }
    }
  );

  // Host manually advances to next round early during reveal phase
  socket.on('battle:advance_round', async (payload: { roomCode: string }) => {
    if (socketRateLimiter.isEventRateLimited(socket.id, 'battle:advance_round', 3)) {
      return socket.emit('battle:advance_acknowledged', { success: false, message: 'Too many advance requests.' });
    }

    const parsed = battleAdvanceRoundPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      return socket.emit('battle:advance_acknowledged', { success: false, message: parsed.error.issues[0].message });
    }
    const roomCode = parsed.data.roomCode;

    try {
      const battle = await battleService.getActiveBattleByRoomCode(roomCode);
      if (!battle) {
        return socket.emit('battle:advance_acknowledged', { success: false, message: 'No active battle found for this room' });
      }

      const room = await roomService.getRoom(roomCode);
      const hostIdStr = room?.hostId ? ((room.hostId as any)._id ? (room.hostId as any)._id.toString() : room.hostId.toString()) : null;
      if (hostIdStr !== userId) {
        return socket.emit('battle:advance_acknowledged', { success: false, message: 'Only the room host can advance rounds' });
      }

      if (battle.currentRound && battle.currentRound.status === 'REVEAL') {
        await battleService.advanceToNextRound(battle._id.toString(), roomCode, io);
        socket.emit('battle:advance_acknowledged', { success: true });
        logger.info(`Host ${userId} advanced round early for room ${roomCode}`);
      } else {
        socket.emit('battle:advance_acknowledged', {
          success: false,
          message: 'Round is no longer in reveal phase or already advanced',
        });
      }
    } catch (err: any) {
      logger.error(err, `Error advancing round early for room ${roomCode}`);
      socket.emit('battle:advance_acknowledged', { success: false, message: err.message || 'Failed to advance round' });
    }
  });

  // Player reconnects to an active or finished battle (e.g. on page refresh)
  socket.on('battle:reconnect', async (payload: { roomCode: string }) => {
    if (socketRateLimiter.isEventRateLimited(socket.id, 'battle:reconnect', 5)) {
      return socket.emit('error', { success: false, message: 'Too many reconnect attempts. Please slow down.' });
    }

    const parsed = battleReconnectPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      return socket.emit('error', { success: false, message: parsed.error.issues[0].message });
    }
    const roomCode = parsed.data.roomCode;

    try {
      const roomChannel = `room:${roomCode}`;
      const isAlreadyInRoom = socket.rooms.has(roomChannel);
      socket.join(roomChannel);
      socket.data.roomCode = roomCode;

      const battle = await battleService.getActiveBattleByRoomCode(roomCode);
      if (battle) {
        // Catch up battle if expired while disconnected
        await battleService.checkAndCatchUpBattle(battle._id.toString(), roomCode, io);

        const currentBattle = await battleService.getActiveBattleByRoomCode(roomCode);
        if (!currentBattle) {
          const finishedBattle = await battleService.getBattleById(battle._id.toString());
          if (finishedBattle && finishedBattle.status === 'COMPLETED') {
            socket.emit('battle:completed', battleService.formatResultsPayload(finishedBattle));
          }
          return;
        }

        // For solo quizzes (1 player), if round 0 has not yet received a submission,
        // synchronize round start with the client socket connection so no time is lost during page navigation
        if (currentBattle.players.length === 1 && currentBattle.currentRound?.roundIndex === 0) {
          await battleService.synchronizeSoloRoundStart(currentBattle._id.toString());
        }

        const refreshedBattle = (await battleService.getActiveBattleByRoomCode(roomCode)) || currentBattle;

        const initPayload = await battleService.getBattleInitPayload(refreshedBattle, userId);
        if (initPayload) {
          socket.emit('battle:init', initPayload);

          // Prevent duplicate reconnection broadcasts and spam logs
          const now = Date.now();
          const lastAnnounced = (socket.data.lastBattleReconnectedAt as number) || 0;
          const shouldAnnounce = !isAlreadyInRoom || (now - lastAnnounced > 3000);

          if (shouldAnnounce) {
            socket.data.lastBattleReconnectedAt = now;
            socket.to(roomChannel).emit('player:reconnected', { userId });
            logger.info(`Player ${userId} reconnected to active battle in room ${roomCode}`);
          }

          // If round is currently revealed, also send reveal payload
          const revealPayload = await battleService.getBattleRevealPayloadIfRevealed(refreshedBattle._id.toString());
          if (revealPayload) {
            socket.emit('battle:reveal', revealPayload);
          }
        }
      } else {
        const room = await roomService.getRoom(roomCode);
        if (room && room.status === 'FINISHED' && room.matchId) {
          const finishedBattle = await battleService.getBattleById(room.matchId.toString());
          if (finishedBattle) {
            socket.emit('battle:completed', battleService.formatResultsPayload(finishedBattle));
            logger.info(`Emitted completed battle state to player ${userId} in finished room ${roomCode}`);
          }
        }
      }
    } catch (error: any) {
      logger.error(error, `Failed to handle battle reconnect for player ${userId} in room ${roomCode}`);
    }
  });
}
