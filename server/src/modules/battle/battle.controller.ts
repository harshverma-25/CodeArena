import { Request, Response } from 'express';
import { battleService } from './battle.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
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
      await battleService.broadcastBattleStart(battle);
    } catch (socketError) {
      logger.error(socketError, 'Failed to broadcast battle socket events');
    }

    return res.status(200).json(
      new ApiResponse(200, {
        battleId: battle._id.toString(),
        matchId: battle._id.toString(),
        roomCode: battle.roomCode,
        status: battle.status,
      }, 'Battle started successfully')
    );
  }
}

export const battleController = new BattleController();
export default battleController;
