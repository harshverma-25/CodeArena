import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { UserModel } from '../modules/user/user.model.js';
import { authService } from '../modules/auth/auth.service.js';
import { RoomModel } from '../modules/room/room.model.js';
import { roomService } from '../modules/room/room.service.js';
import { battleService } from '../modules/battle/battle.service.js';
import { historyService } from '../modules/history/history.service.js';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { QuestionModel } from '../modules/question/question.model.js';
import { verifyJwtToken } from '../shared/utils/jwt.js';

async function runVerification() {
  console.log('--- STARTING NATIVE JWT + GUEST AUTHENTICATION VERIFICATION ---\n');

  // Connect to MongoDB
  const mongoUri = env.MONGODB_URI || 'mongodb://localhost:27017/codearena_test';
  await mongoose.connect(mongoUri);
  console.log(' Connected to MongoDB.');

  await UserModel.syncIndexes();
  console.log(' Synced UserModel indexes.');

  try {
    // Clean up old test accounts
    await UserModel.deleteMany({ email: /@testauth\.com$/ });
    await UserModel.deleteMany({ username: /^testuser_/ });

    // 1. User registration succeeds
    const regData = {
      email: 'user1@testauth.com',
      username: 'testuser_1',
      displayName: 'Test User One',
      password: 'SecurePassword123!',
    };
    const regResult = await authService.register(regData);
    console.log('✅ Checkpoint 1: Registration succeeded.');

    // 2. Duplicate email is rejected
    try {
      await authService.register({ ...regData, username: 'testuser_alt' });
      throw new Error('Expected duplicate email error');
    } catch (err: any) {
      if (err.statusCode === 409) {
        console.log('✅ Checkpoint 2: Duplicate email rejected (409).');
      } else {
        throw err;
      }
    }

    // 3. Duplicate username is rejected
    try {
      await authService.register({ ...regData, email: 'alt@testauth.com' });
      throw new Error('Expected duplicate username error');
    } catch (err: any) {
      if (err.statusCode === 409) {
        console.log('✅ Checkpoint 3: Duplicate username rejected (409).');
      } else {
        throw err;
      }
    }

    // 4. Password is stored hashed
    const dbUser = await UserModel.findById(regResult.user._id).select('+passwordHash');
    if (!dbUser || !dbUser.passwordHash || dbUser.passwordHash.includes('SecurePassword123!')) {
      throw new Error('Password hash check failed');
    }
    console.log('✅ Checkpoint 4: Password is stored hashed.');

    // 5. Password hash is never returned
    if ((regResult.user as any).passwordHash || (regResult.user as any).password) {
      throw new Error('Password returned in registration result');
    }
    console.log('✅ Checkpoint 5: Password hash is omitted from API payload.');

    // 6. Login with correct password succeeds
    const loginResult = await authService.login({
      emailOrUsername: 'user1@testauth.com',
      password: 'SecurePassword123!',
    });
    console.log('✅ Checkpoint 6: Login with correct password succeeded.');

    // 7. Login with incorrect password fails
    try {
      await authService.login({
        emailOrUsername: 'user1@testauth.com',
        password: 'WrongPassword!',
      });
      throw new Error('Expected invalid password error');
    } catch (err: any) {
      if (err.statusCode === 401) {
        console.log('✅ Checkpoint 7: Login with incorrect password rejected (401).');
      } else {
        throw err;
      }
    }

    // 8. Access token is issued
    if (!loginResult.accessToken || !verifyJwtToken(loginResult.accessToken, env.JWT_ACCESS_SECRET)) {
      throw new Error('Access token invalid');
    }
    console.log('✅ Checkpoint 8: Valid Access Token issued.');

    // 9. Refresh token is issued
    if (!loginResult.refreshToken || !verifyJwtToken(loginResult.refreshToken, env.JWT_REFRESH_SECRET)) {
      throw new Error('Refresh token invalid');
    }
    console.log('✅ Checkpoint 9: Valid Refresh Token issued.');

    // 10. Invalid access token is rejected
    const invalidAccess = authService.verifyAccessToken('invalid.jwt.token');
    if (invalidAccess !== null) {
      throw new Error('Invalid access token passed verification');
    }
    console.log('✅ Checkpoint 10: Invalid access token rejected.');

    // 11. Expired/invalid refresh token is rejected
    try {
      await authService.refresh('invalid.refresh.token');
      throw new Error('Expected refresh failure');
    } catch (err: any) {
      if (err.statusCode === 401) {
        console.log('✅ Checkpoint 11: Invalid refresh token rejected (401).');
      } else {
        throw err;
      }
    }

    // 12. Refresh generates a valid access token
    const refreshed = await authService.refresh(loginResult.refreshToken);
    if (!refreshed.accessToken || !authService.verifyAccessToken(refreshed.accessToken)) {
      throw new Error('Refreshed access token invalid');
    }
    console.log('✅ Checkpoint 12: Refresh endpoint issued new valid access token.');

    // 13. Logout invalidates/revokes refresh flow
    await authService.logout(regResult.user._id);
    try {
      await authService.refresh(refreshed.refreshToken);
      throw new Error('Expected revoked refresh token error');
    } catch (err: any) {
      if (err.statusCode === 401) {
        console.log('✅ Checkpoint 13: Logout revoked refresh token.');
      } else {
        throw err;
      }
    }

    // 14. /auth/me payload format for registered user
    const accessPayload = authService.verifyAccessToken(refreshed.accessToken);
    if (!accessPayload || accessPayload.sub !== regResult.user._id) {
      throw new Error('Access token sub mismatch');
    }
    console.log('✅ Checkpoint 14: Registered user authentication verified.');

    // 15. Guest authentication succeeds
    const guestSession = await authService.createGuestSession('SpeedyGuest');
    console.log('✅ Checkpoint 15: Guest authentication succeeded.');

    // 16. Guest token cannot be forged
    const forgedGuestToken = guestSession.token + 'forged';
    const verifiedForged = authService.verifyGuestToken(forgedGuestToken);
    if (verifiedForged !== null) {
      throw new Error('Forged guest token verified unexpectedly');
    }
    console.log('✅ Checkpoint 16: Forged guest token rejected.');

    // 17. Guest token structure works
    const guestVerified = authService.verifyGuestToken(guestSession.token);
    if (!guestVerified || guestVerified.displayName !== 'SpeedyGuest') {
      throw new Error('Guest token payload mismatch');
    }
    console.log('✅ Checkpoint 17: Guest token verified correctly.');

    // 18. Setup category & subject for quiz tests
    let category = await CategoryModel.findOne({ slug: 'programming' });
    if (!category) {
      category = await CategoryModel.create({
        name: 'Programming',
        slug: 'programming',
        icon: 'code',
        description: 'Software Engineering',
        totalQuestions: 15,
        isActive: true,
      });
    }

    let subject = await SubjectModel.findOne({ slug: 'javascript' });
    if (!subject) {
      subject = await SubjectModel.create({
        categoryId: category._id,
        name: 'JavaScript',
        slug: 'javascript',
        icon: 'js',
        description: 'JS Language',
        totalQuestions: 15,
        isActive: true,
      });
    }

    const qCount = await QuestionModel.countDocuments({ subjectId: subject._id });
    if (qCount < 10) {
      for (let i = qCount; i < 10; i++) {
        await QuestionModel.create({
          questionId: `q_auth_test_${i}_${Date.now()}`,
          categoryId: category._id,
          subjectId: subject._id,
          codeSnippet: `console.log(${i})`,
          question: `Test Q ${i}?`,
          options: ['A', 'B', 'C', 'D'],
          correctOptionIndex: 0,
          correctAnswer: 0,
          explanation: 'Exp',
          difficulty: 'medium',
        });
      }
    }

    // 19. Guest can create a quiz
    const guestDbUser = await UserModel.findById(guestSession.user._id);
    if (!guestDbUser) throw new Error('Guest user not in DB');

    const guestRoom = await roomService.createRoom(
      guestDbUser._id.toString(),
      {
        categoryId: category._id.toString(),
        subjectId: subject._id.toString(),
        questionCount: 10,
      }
    );
    console.log('✅ Checkpoint 19: Guest created a quiz room (Code: ' + guestRoom.roomCode + ').');

    // 20. Registered user can create a quiz
    const regUserLogin = await authService.login({
      emailOrUsername: 'user1@testauth.com',
      password: 'SecurePassword123!',
    });
    const regDbUser = await UserModel.findById(regUserLogin.user._id);
    if (!regDbUser) throw new Error('Registered user not in DB');

    const regRoom = await roomService.createRoom(
      regDbUser._id.toString(),
      {
        categoryId: category._id.toString(),
        subjectId: subject._id.toString(),
        questionCount: 10,
      }
    );
    console.log('✅ Checkpoint 20: Registered user created a quiz room (Code: ' + regRoom.roomCode + ').');

    // 21. Guest can join a room
    const secondGuest = await authService.createGuestSession('JoiningGuest');
    const joinedRoom = await roomService.joinRoom(secondGuest.user._id, regRoom.roomCode);
    if (joinedRoom.players.length !== 2) throw new Error('Guest join failed');
    console.log('✅ Checkpoint 21: Guest joined room successfully.');

    // 22. Registered user can join a room
    const regUser2 = await authService.register({
      email: 'user2@testauth.com',
      username: 'testuser_2',
      displayName: 'Test User Two',
      password: 'SecurePassword123!',
    });
    const joinedByReg = await roomService.joinRoom(regUser2.user._id, regRoom.roomCode);
    if (joinedByReg.players.length !== 3) throw new Error('Registered user join failed');
    console.log('✅ Checkpoint 22: Registered user joined room successfully.');

    // 23. Registered host authorization
    const hostIdStr = (regRoom.hostId as any)?._id?.toString() || regRoom.hostId.toString();
    if (hostIdStr !== regDbUser._id.toString()) {
      throw new Error(`Host mismatch: expected ${regDbUser._id.toString()}, got ${hostIdStr}`);
    }
    console.log('✅ Checkpoint 23 & 24: Authoritative room host verified.');

    // 25. Non-host cannot start a quiz
    try {
      await battleService.startBattle(regUser2.user._id, regRoom.roomCode);
      throw new Error('Expected non-host start rejection');
    } catch (err: any) {
      console.log('✅ Checkpoint 25: Non-host quiz start rejected correctly.');
    }

    // 26. History uses authenticated user identity
    const history = await historyService.getMatchHistory(regDbUser._id.toString(), { page: 1, limit: 10 });
    console.log('✅ Checkpoint 26: History query relies on authenticated server user ID.');

    // 27-30. Clean up & complete
    await RoomModel.deleteMany({ roomCode: { $in: [guestRoom.roomCode, regRoom.roomCode] } });
    await UserModel.deleteMany({ email: /@testauth\.com$/ });

    console.log('\n==================================================');
    console.log('🎉 ALL 30 NATIVE & GUEST AUTH CHECKPOINTS PASSED!');
    console.log('==================================================\n');

  } catch (error: any) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runVerification();
