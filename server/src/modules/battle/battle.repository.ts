import { BattleModel } from './battle.model.js';
import { IBattle, IBattleDocument, BattleStatus } from './battle.types.js';

export class BattleRepository {
  /**
   * Create a new Battle document.
   */
  async create(data: Partial<IBattle>): Promise<IBattleDocument> {
    const battle = new BattleModel(data);
    return battle.save();
  }

  /**
   * Find a battle by battleId.
   */
  async findById(battleId: string): Promise<IBattleDocument | null> {
    return BattleModel.findById(battleId).populate('players.userId', 'username displayName avatar');
  }

  /**
   * Find active battle for a specific roomCode.
   */
  async findActiveByRoomCode(roomCode: string): Promise<IBattleDocument | null> {
    return BattleModel.findOne({
      roomCode: roomCode.toUpperCase(),
      status: BattleStatus.IN_PROGRESS,
    }).populate('players.userId', 'username displayName avatar');
  }

  /**
   * Save / update a battle document.
   */
  async save(battle: IBattleDocument): Promise<IBattleDocument> {
    return battle.save();
  }
}

export const battleRepository = new BattleRepository();
export default battleRepository;
