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
   * Atomically record player submission to the current round.
   * Ensures no duplicate submissions and that round is still in QUESTION status.
   */
  async recordRoundSubmission(
    battleId: string,
    roundIndex: number,
    submission: any
  ): Promise<IBattleDocument | null> {
    return BattleModel.findOneAndUpdate(
      {
        _id: battleId,
        status: BattleStatus.IN_PROGRESS,
        'currentRound.roundIndex': roundIndex,
        'currentRound.status': 'QUESTION',
        'currentRound.submissions.userId': { $ne: submission.userId },
      },
      {
        $push: {
          'currentRound.submissions': submission,
        },
      },
      { new: true }
    ).populate('players.userId', 'username displayName avatar');
  }

  /**
   * Atomically transition round from QUESTION to REVEAL status.
   * Idempotent: returns null if already transitioned.
   */
  async transitionRoundToReveal(
    battleId: string,
    revealExpiresAt: Date
  ): Promise<IBattleDocument | null> {
    return BattleModel.findOneAndUpdate(
      {
        _id: battleId,
        status: BattleStatus.IN_PROGRESS,
        'currentRound.status': 'QUESTION',
      },
      {
        $set: {
          'currentRound.status': 'REVEAL',
          'currentRound.revealExpiresAt': revealExpiresAt,
        },
      },
      { new: true }
    ).populate('players.userId', 'username displayName avatar');
  }

  /**
   * Query all active battles where question deadline or reveal timer has expired.
   */
  async findExpiredRounds(now: Date = new Date()): Promise<IBattleDocument[]> {
    return BattleModel.find({
      status: BattleStatus.IN_PROGRESS,
      $or: [
        {
          'currentRound.status': 'QUESTION',
          'currentRound.deadline': { $lte: now },
        },
        {
          'currentRound.status': 'REVEAL',
          'currentRound.revealExpiresAt': { $lte: now },
        },
      ],
    }).populate('players.userId', 'username displayName avatar');
  }

  /**
   * Synchronize solo round 0 start time upon client socket reconnect.
   */
  async updateSoloRoundStartTime(
    battleId: string,
    startedAt: Date,
    deadline: Date
  ): Promise<IBattleDocument | null> {
    return BattleModel.findOneAndUpdate(
      {
        _id: battleId,
        status: BattleStatus.IN_PROGRESS,
        'currentRound.roundIndex': 0,
        'currentRound.status': 'QUESTION',
        'currentRound.submissions': { $size: 0 },
      },
      {
        $set: {
          'currentRound.startedAt': startedAt,
          'currentRound.deadline': deadline,
          'players.0.questionDeadline': deadline,
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

  /**
   * Find abandoned IN_PROGRESS battles updated before the given cutoff date.
   */
  async findAbandonedBattles(cutoff: Date): Promise<IBattleDocument[]> {
    return BattleModel.find({
      status: BattleStatus.IN_PROGRESS,
      updatedAt: { $lte: cutoff },
    }).exec();
  }

  /**
   * Atomically cancel an abandoned battle.
   */
  async cancelAbandonedBattle(battleId: any): Promise<IBattleDocument | null> {
    return BattleModel.findOneAndUpdate(
      { _id: battleId, status: BattleStatus.IN_PROGRESS },
      { $set: { status: BattleStatus.CANCELLED, endedAt: new Date() } },
      { new: true }
    ).exec();
  }
}

export const battleRepository = new BattleRepository();
export default battleRepository;
