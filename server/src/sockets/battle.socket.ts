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

      // 4. Register server-authoritative question deadline timer for the synchronized round
      battleService.setRoundTimeout(
        battle._id.toString(),
        0,
        battle.timePerQuestion * 1000 + 1000,
        io,
        roomCode
      );

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
    const roomCode = payload?.roomCode?.toUpperCase();
    if (!roomCode) return;

    try {
      const battle = await battleService.getActiveBattleByRoomCode(roomCode);
      if (!battle) return;

      const room = await roomService.getRoom(roomCode);
      const hostIdStr = room?.hostId ? ((room.hostId as any)._id ? (room.hostId as any)._id.toString() : room.hostId.toString()) : null;
      if (hostIdStr !== userId) return;

      const activeRound = battleService.getActiveRound(battle._id.toString());
      if (activeRound && activeRound.isRevealed) {
        await battleService.advanceToNextRound(battle._id.toString(), roomCode, io);
      }
    } catch (err: any) {
      logger.error(err, `Error advancing round early for room ${roomCode}`);
    }
  });

  // Player reconnects to an active or finished battle (e.g. on page refresh)
  socket.on('battle:reconnect', async (payload: { roomCode: string }) => {
    const roomCode = payload?.roomCode?.toUpperCase();
    if (!roomCode) {
      return socket.emit('error', { success: false, message: 'Room code is required' });
    }

    try {
      const roomChannel = `room:${roomCode}`;
      socket.join(roomChannel);
      socket.data.roomCode = roomCode;

      const battle = await battleService.getActiveBattleByRoomCode(roomCode);
      if (battle) {
        const initPayload = await battleService.getBattleInitPayload(battle, userId);
        if (initPayload) {
          socket.emit('battle:init', initPayload);
          socket.to(roomChannel).emit('player:reconnected', { userId });
          logger.info(`Player ${userId} reconnected to active battle in room ${roomCode}`);

          // If round is currently revealed, also send reveal payload
          const revealPayload = await battleService.getBattleRevealPayloadIfRevealed(battle._id.toString());
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
