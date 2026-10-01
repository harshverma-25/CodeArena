import { Request, Response } from 'express';
import { battleService } from './battle.service.js';
import { roomRepository } from '../room/room.repository.js';
import { getIo } from '../../sockets/socket.js';
import { formatRoomSocketPayload } from '../../sockets/room.socket.js';
import { logger } from '../../config/logger.js';

export class BattleController {
  /**
   * Start a battle inside a room. Only the room host can initiate this.
   * POST /api/v1/battles/start
   */
  async startBattle(req: Request, res: Response) {
    const userId = req.user!._id.toString();
    const { roomCode } = req.body;
    const battle = await battleService.startBattle(userId, roomCode);

    try {
      const io = getIo();
      const code = battle.roomCode;
      const roomChannel = `room:${code}`;

      // Update room state for sockets
      const updatedRoom = await roomRepository.findByRoomCode(code);
      if (updatedRoom) {
        io.to(roomChannel).emit('room:update', formatRoomSocketPayload(updatedRoom));
      }

      // Emit battle:init to sockets
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

      // Register server timers
      for (const p of battle.players) {
        const pUserId = (p.userId as any)._id ? (p.userId as any)._id.toString() : p.userId.toString();
        battleService.setQuestionTimeout(
          battle._id.toString(),
          pUserId,
          0,
          battle.timePerQuestion * 1000,
          io,
          code
        );
      }
    } catch (socketError) {
      logger.error(socketError, 'Failed to broadcast battle socket events');
    }

    return res.status(200).json({
      success: true,
      message: 'Battle started successfully',
      data: {
        battleId: battle._id.toString(),
        matchId: battle._id.toString(),
        roomCode: battle.roomCode,
        status: battle.status,
      },
    });
  }
}

export const battleController = new BattleController();
export default battleController;
