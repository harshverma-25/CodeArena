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
    const code = roomCode.toUpperCase();
    const room = await roomRepository.findByRoomCode(code);
    if (!room) {
      throw new ApiError(404, 'Room not found');
    }

    // 1. Host validation
    const hostIdStr = room.hostId && (room.hostId as any)._id ? (room.hostId as any)._id.toString() : room.hostId.toString();
    if (hostIdStr !== userId) {
      throw new ApiError(403, 'Only the room host can start the match');
    }

    // 2. Room status validation - must not be in progress or completed
    if (room.status === RoomStatus.IN_PROGRESS) {
      throw new ApiError(400, 'Match has already started');
    }
    if (room.status === RoomStatus.FINISHED || room.status === RoomStatus.CANCELLED) {
      throw new ApiError(400, 'Cannot start a match in a completed or cancelled room');
    }

    // 3. Player quantity validation (exactly 2 players)
    if (room.players.length !== 2) {
      throw new ApiError(400, 'Room must contain exactly two players to start the match');
    }

    // 4. Both players must be ready
    const allReady = room.players.every((p) => p.isReady);
    if (!allReady) {
      throw new ApiError(400, 'All players must be ready to start the match');
    }

    // 5. Select a random published problem based on room settings
    const problem = await problemRepository.findRandom({
      topic: room.settings.topic,
      difficulty: room.settings.difficulty,
    });
    if (!problem) {
      throw new ApiError(404, 'No published problems found matching room settings');
    }

    // 6. Create the Match document
    const match = await matchRepository.create({
      roomId: room._id as any,
      problemId: problem._id as any,
      players: room.players.map((p) => ({ userId: p.userId && (p.userId as any)._id ? (p.userId as any)._id : p.userId })),
      status: MatchStatus.IN_PROGRESS,
      startedAt: new Date(),
      duration: room.settings.duration * 60, // Settings duration is in minutes, convert to seconds
    });

    // 7. Update Room Status to IN_PROGRESS and associate the match ID
    await roomRepository.update(code, {
      status: RoomStatus.IN_PROGRESS,
      matchId: match._id as any,
    });

    // 8. Broadcast match:start through Socket.IO
    try {
      const io = getIo();
      io.to(`room:${code}`).emit('match:start', {
        matchId: match._id.toString(),
        roomCode: code,
        problem: {
          _id: problem._id.toString(),
          title: problem.title,
          description: problem.description,
          examples: problem.examples,
          constraints: problem.constraints,
          starterCode: problem.starterCode,
        },
        duration: match.duration,
        startedAt: match.startedAt,
      });
      logger.info(`Broadcasted match:start to room:${code} for match ${match._id}`);
    } catch (socketError) {
      logger.error(socketError, 'Failed to broadcast match:start event via Socket.IO');
    }

    return {
      matchId: match._id.toString(),
      problem: {
        _id: problem._id.toString(),
        title: problem.title,
        description: problem.description,
        examples: problem.examples,
        constraints: problem.constraints,
        starterCode: problem.starterCode,
      },
      duration: match.duration,
      startedAt: match.startedAt,
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
