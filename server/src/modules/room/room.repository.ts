import { RoomModel } from './room.model.js';
import { IRoom, IRoomDocument, IRoomPlayer } from './room.types.js';
import { Types } from 'mongoose';

export class RoomRepository {
  async create(roomData: Partial<IRoom>): Promise<IRoomDocument> {
    const room = new RoomModel(roomData);
    return room.save();
  }

  async findByRoomCode(roomCode: string): Promise<IRoomDocument | null> {
    return RoomModel.findOne({ roomCode }).populate('hostId').populate('players.userId').exec();
  }

  async update(roomCode: string, updateData: Partial<IRoom>): Promise<IRoomDocument | null> {
    return RoomModel.findOneAndUpdate({ roomCode }, updateData, { new: true })
      .populate('hostId')
      .populate('players.userId')
      .exec();
  }

  async delete(roomCode: string): Promise<IRoomDocument | null> {
    return RoomModel.findOneAndDelete({ roomCode }).exec();
  }

  async addPlayer(roomCode: string, player: IRoomPlayer): Promise<IRoomDocument | null> {
    return RoomModel.findOneAndUpdate(
      { roomCode },
      { $addToSet: { players: player } },
      { new: true }
    )
      .populate('hostId')
      .populate('players.userId')
      .exec();
  }

  async removePlayer(roomCode: string, userId: string): Promise<IRoomDocument | null> {
    return RoomModel.findOneAndUpdate(
      { roomCode },
      { $pull: { players: { userId: new Types.ObjectId(userId) } } },
      { new: true }
    )
      .populate('hostId')
      .populate('players.userId')
      .exec();
  }
}

export const roomRepository = new RoomRepository();
