import { Schema, model } from 'mongoose';
import { IUserDocument } from './user.types.js';

const UserSchema = new Schema<IUserDocument>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    avatar: { type: String, default: '' },
    matchesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    highestWinStreak: { type: Number, default: 0 },
<<<<<<< HEAD
=======
    preferredLanguage: { type: String, default: 'javascript' },
    isGuest: { type: Boolean, default: false, index: true },
    role: { type: String, enum: ['user', 'guest', 'admin'], default: 'user' },
>>>>>>> 461132e (feat(auth): add secure guest login)
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<IUserDocument>('User', UserSchema);
export default UserModel;
