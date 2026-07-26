import { MatchModel } from './match.model.js';
import { IMatch, IMatchDocument } from './match.types.js';
import { Types } from 'mongoose';

export class MatchRepository {
  async create(matchData: Partial<IMatch>): Promise<IMatchDocument> {
    const match = new MatchModel(matchData);
    return match.save();
  }

  async findById(matchId: string): Promise<IMatchDocument | null> {
    return MatchModel.findById(matchId)
      .populate('roomId')
      .populate('problemId')
      .populate('players.userId')
      .populate('winnerId')
      .exec();
  }

  async findHistory(
    userId: string,
    options: { page?: number; limit?: number } = {}
  ): Promise<{ matches: IMatchDocument[]; total: number }> {
    const userObjectId = new Types.ObjectId(userId);
    const query = { 'players.userId': userObjectId };

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [matches, total] = await Promise.all([
      MatchModel.find(query)
        .sort({ startedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('problemId')
        .populate('players.userId')
        .populate('winnerId')
        .exec(),
      MatchModel.countDocuments(query).exec(),
    ]);

    return { matches, total };
  }

  async updateWinner(
    matchId: string,
    winnerId: string | null,
    status: string,
    endedAt: Date,
    duration: number
  ): Promise<IMatchDocument | null> {
    const winnerObjectId = winnerId ? new Types.ObjectId(winnerId) : null;
    return MatchModel.findByIdAndUpdate(
      matchId,
      {
        winnerId: winnerObjectId,
        status,
        endedAt,
        duration,
      },
      { new: true }
    )
      .populate('roomId')
      .populate('problemId')
      .populate('players.userId')
      .populate('winnerId')
      .exec();
  }
}

export const matchRepository = new MatchRepository();
