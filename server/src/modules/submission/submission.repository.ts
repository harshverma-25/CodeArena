import { SubmissionModel } from './submission.model.js';
import { ISubmission, ISubmissionDocument } from './submission.types.js';
import { Types } from 'mongoose';

export class SubmissionRepository {
  async create(submissionData: Partial<ISubmission>): Promise<ISubmissionDocument> {
    const submission = new SubmissionModel(submissionData);
    return submission.save();
  }

  async findById(submissionId: string): Promise<ISubmissionDocument | null> {
    return SubmissionModel.findById(submissionId)
      .populate('matchId')
      .populate('userId')
      .exec();
  }

  async findByMatch(matchId: string): Promise<ISubmissionDocument[]> {
    return SubmissionModel.find({ matchId: new Types.ObjectId(matchId) })
      .sort({ submittedAt: 1 })
      .populate('userId')
      .exec();
  }

  async findAcceptedSubmission(matchId: string, userId: string): Promise<ISubmissionDocument | null> {
    return SubmissionModel.findOne({
      matchId: new Types.ObjectId(matchId),
      userId: new Types.ObjectId(userId),
      isFinalAccepted: true,
    }).exec();
  }

  async getLatestSubmissionNumber(matchId: string, userId: string): Promise<number> {
    const latest = await SubmissionModel.findOne({
      matchId: new Types.ObjectId(matchId),
      userId: new Types.ObjectId(userId),
    })
      .sort({ submissionNumber: -1 })
      .select('submissionNumber')
      .exec();

    return latest ? latest.submissionNumber : 0;
  }
}

export const submissionRepository = new SubmissionRepository();
