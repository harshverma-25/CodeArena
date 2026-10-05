import { Schema, model } from 'mongoose';
import { IUserDocument } from './user.types.js';

const UserSchema = new Schema<IUserDocument>(
  {
    clerkId: { type: String, unique: true, sparse: true, index: true },
    email: { type: String, unique: true, sparse: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    refreshTokenHash: { type: String, select: false },
    username: { type: String, required: true, unique: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    matchesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    preferredLanguage: { type: String, default: 'javascript' },
    isGuest: { type: Boolean, default: false, index: true },
    role: { type: String, enum: ['user', 'guest', 'admin'], default: 'user' },
  },
  {
    timestamps: true,
  }
);

// Compound index for optimized global leaderboard sorting & rank calculation
UserSchema.index({ isGuest: 1, wins: -1, accuracy: -1, matchesPlayed: -1, username: 1 });

export const UserModel = model<IUserDocument>('User', UserSchema);
export default UserModel;
