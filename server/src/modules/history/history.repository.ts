import { BattleModel } from '../battle/battle.model.js';
import { IBattleDocument } from '../battle/battle.types.js';

export class HistoryRepository {
  /**
   * Fetch paginated list of battles in which the given user participated.
   */
  async getUserBattleHistory(
    userId: string,
    options: { page: number; limit: number }
  ): Promise<{ battles: IBattleDocument[]; total: number }> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 10));
    const skip = (page - 1) * limit;

    const query = {
      'players.userId': userId,
    };

    const [battles, total] = await Promise.all([
      BattleModel.find(query)
        .sort({ startedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('players.userId', 'username displayName avatar')
        .populate('winnerId', 'username displayName avatar')
        .populate('roomId', 'settings roomCode')
        .exec(),
      BattleModel.countDocuments(query),
    ]);

    return { battles, total };
  }

  /**
   * Find battle by ID with populated player user details.
   */
  async getBattleById(battleId: string): Promise<IBattleDocument | null> {
    return BattleModel.findById(battleId)
      .populate('players.userId', 'username displayName avatar')
      .populate('winnerId', 'username displayName avatar')
      .populate('roomId', 'settings roomCode')
      .exec();
  }
}

export const historyRepository = new HistoryRepository();
export default historyRepository;
