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
   * Find battle by roomCode with populated player user details.
   */
  async findByRoomCode(roomCode: string): Promise<IBattleDocument | null> {
    return BattleModel.findOne({
      roomCode: roomCode.toUpperCase(),
    }).populate('players.userId', 'username displayName avatar');
  }

  /**
   * Fetch recent completed battles for a user.
   */
  async findRecentCompletedByUserId(userId: any, limit: number = 10): Promise<IBattleDocument[]> {
    return BattleModel.find({
      'players.userId': userId,
      status: BattleStatus.COMPLETED,
    })
      .sort({ endedAt: -1, startedAt: -1 })
      .limit(limit)
      .populate('players.userId', 'username displayName avatar')
      .populate('winnerId', 'username displayName avatar')
      .lean()
      .exec() as any;
  }

  /**
   * Atomically transition battle to COMPLETED status.
   * Returns document only if battle was not already COMPLETED.
   */
  async transitionToCompleted(
    battleId: any,
    updateData: {
      winnerId: any;
      isDraw: boolean;
      endedAt: Date;
      players: any[];
    }
  ): Promise<IBattleDocument | null> {
    return BattleModel.findOneAndUpdate(
      {
        _id: battleId,
        status: { $ne: BattleStatus.COMPLETED },
      },
      {
        $set: {
          status: BattleStatus.COMPLETED,
          ...updateData,
        },
      },
      { new: true }
    );
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
