import { matchRepository } from './match.repository.js';
import { roomRepository } from '../room/room.repository.js';
import { problemRepository } from '../problem/problem.repository.js';
import { MatchStatus, IMatchDocument } from './match.types.js';
import { RoomStatus } from '../room/room.types.js';
import { ApiError } from '../../shared/errors/api-error.js';
import { getIo } from '../../sockets/socket.js';
import { logger } from '../../config/logger.js';

export class MatchService {
  /**
   * Start a match inside a room. Only the room host can initiate this.
   */
  async startMatch(userId: string, roomCode: string) {
    const { battleService } = await import('../battle/battle.service.js');
    const { formatRoomSocketPayload } = await import('../../sockets/room.socket.js');
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

    return {
      matchId: battle._id.toString(),
      battleId: battle._id.toString(),
      roomCode: battle.roomCode,
      status: battle.status,
    };
  }

  /**
   * Retrieve match details by match ID.
   */
  async getMatch(matchId: string): Promise<IMatchDocument> {
    const match = await matchRepository.findById(matchId);
    if (!match) {
      throw new ApiError(404, 'Match not found');
    }
    return match;
  }

  /**
   * Get match history for the authenticated user (paginated).
   */
  async getMatchHistory(
    userId: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<{ matches: IMatchDocument[]; total: number }> {
    return matchRepository.findHistory(userId, options);
  }
}

export const matchService = new MatchService();
export default matchService;
