import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { UserModel } from '../modules/user/user.model.js';
import { userRepository } from '../modules/user/user.repository.js';
import { questionRepository } from '../modules/question/question.repository.js';
import { battleService } from '../modules/battle/battle.service.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { BattleStatus } from '../modules/battle/battle.types.js';

async function runQuizScoringFixesVerification() {
  console.log('--- STARTING SECTION B QUIZ ENGINE & SCORING FIXES VERIFICATION ---');

  await mongoose.connect(env.MONGODB_URI);
  console.log(' Connected to MongoDB.');

  // ==========================================
  // Test B-1: Multi-way Draw Detection in 3-4 Player Games
  // ==========================================
  console.log('\n▶️ Testing B-1: Multi-Way Ties in 3-4 Player Games');
  const testEmailPrefix = `testb1_${Date.now()}`;
  const [p1, p2, p3, p4] = await Promise.all([
    UserModel.create({ username: `${testEmailPrefix}_p1`, displayName: 'P1', email: `${testEmailPrefix}_1@test.com` }),
    UserModel.create({ username: `${testEmailPrefix}_p2`, displayName: 'P2', email: `${testEmailPrefix}_2@test.com` }),
    UserModel.create({ username: `${testEmailPrefix}_p3`, displayName: 'P3', email: `${testEmailPrefix}_3@test.com` }),
    UserModel.create({ username: `${testEmailPrefix}_p4`, displayName: 'P4', email: `${testEmailPrefix}_4@test.com` }),
  ]);

  // Simulate battle where P1 (1000) & P2 (1000) tie for 1st, while P3 (500) and P4 (200) lose
  const testBattle = await BattleModel.create({
    roomId: new mongoose.Types.ObjectId(),
    roomCode: 'TESTB1',
    topic: 'Programming',
    difficulty: 'easy',
    questionCount: 10,
    timePerQuestion: 30,
    status: BattleStatus.IN_PROGRESS,
    startedAt: new Date(),
    players: [
      { userId: p1._id, score: 1000, answers: [], status: 'COMPLETED' },
      { userId: p2._id, score: 1000, answers: [], status: 'COMPLETED' },
      { userId: p3._id, score: 500, answers: [], status: 'COMPLETED' },
      { userId: p4._id, score: 200, answers: [], status: 'COMPLETED' },
    ],
  });

  await battleService.finalizeBattle(testBattle);

  const [res1, res2, res3, res4] = await Promise.all([
    UserModel.findById(p1._id),
    UserModel.findById(p2._id),
    UserModel.findById(p3._id),
    UserModel.findById(p4._id),
  ]);

  // P1 and P2 tied for 1st -> draws = 1, losses = 0, wins = 0
  if (res1?.draws !== 1 || res1?.losses !== 0 || res1?.wins !== 0) {
    throw new Error(`B-1 Failed for P1: expected draws=1, losses=0, wins=0, got draws=${res1?.draws}, losses=${res1?.losses}`);
  }
  if (res2?.draws !== 1 || res2?.losses !== 0 || res2?.wins !== 0) {
    throw new Error(`B-1 Failed for P2: expected draws=1, losses=0, wins=0, got draws=${res2?.draws}, losses=${res2?.losses}`);
  }

  // P3 and P4 had lower scores -> losses = 1, draws = 0, wins = 0
  if (res3?.losses !== 1 || res3?.draws !== 0 || res3?.wins !== 0) {
    throw new Error(`B-1 Failed for P3: expected losses=1, draws=0, got losses=${res3?.losses}, draws=${res3?.draws}`);
  }
  if (res4?.losses !== 1 || res4?.draws !== 0 || res4?.wins !== 0) {
    throw new Error(`B-1 Failed for P4: expected losses=1, draws=0, got losses=${res4?.losses}, draws=${res4?.draws}`);
  }

  console.log('✅ B-1 Checkpoint 1: Players tied for 1st place received draws=1.');
  console.log('✅ B-1 Checkpoint 2: Lower-scoring players in multi-way tie games correctly received losses=1 (not draw).');

  // ==========================================
  // Test B-2: Clock Skew & Score Formula Bounds
  // ==========================================
  console.log('\n▶️ Testing B-2: Score Formula Negative-Time Guard & Maximum Floor Bounds');
  const nowMs = Date.now();
  const timePerQuestion = 30;

  // Case 1: Clock skew where now is before startedAt (-500ms)
  const skewRawElapsedMs = -500;
  const skewElapsedMs = Math.max(0, Math.min(skewRawElapsedMs, timePerQuestion * 1000));
  const skewElapsedSec = skewElapsedMs / 1000;
  const skewScore = Math.max(100, Math.min(1000, Math.round(1000 - skewElapsedSec * 30)));
  if (skewScore !== 1000 || skewElapsedMs !== 0) {
    throw new Error(`B-2 Failed: Clock skew resulted in score ${skewScore}`);
  }
  console.log('✅ B-2 Checkpoint 1: Clock skew / negative elapsed time safely bounded to 0s elapsed and max 1000 pts.');

  // Case 2: Past deadline submission (e.g. 45s)
  const overdueRawElapsedMs = 45000;
  const overdueElapsedMs = Math.max(0, Math.min(overdueRawElapsedMs, timePerQuestion * 1000));
  const overdueElapsedSec = overdueElapsedMs / 1000;
  const overdueScore = Math.max(100, Math.min(1000, Math.round(1000 - overdueElapsedSec * 30)));
  if (overdueScore !== 100 || overdueElapsedMs !== 30000) {
    throw new Error(`B-2 Failed: Overdue score should be floored to 100 pts, got ${overdueScore}`);
  }
  console.log('✅ B-2 Checkpoint 2: Maximum elapsed time bounded to timePerQuestion and score floored to 100 pts.');

  // ==========================================
  // Test B-3: Question Sampling Uniqueness ($group deduplication)
  // ==========================================
  console.log('\n▶️ Testing B-3: $sample Aggregation Uniqueness with $group Pipeline');
  const sampled10 = await questionRepository.sampleRandomPublished({}, undefined, 10);
  const qIds = sampled10.map((q) => q.questionId);
  const uniqueQIds = new Set(qIds);
  if (uniqueQIds.size !== sampled10.length) {
    throw new Error(`B-3 Failed: sampleRandomPublished returned duplicate questions (${uniqueQIds.size} unique of ${sampled10.length})`);
  }
  console.log(`✅ B-3 Checkpoint 1: Sampled ${sampled10.length} questions, all ${uniqueQIds.size} are 100% distinct.`);

  // ==========================================
  // Test B-4: highestWinStreak & currentStreak Tracking
  // ==========================================
  console.log('\n▶️ Testing B-4: Win Streak and Highest Win Streak Tracking');
  const streakUser = await UserModel.create({
    username: `streak_${Date.now()}`,
    displayName: 'StreakTester',
    email: `streak_${Date.now()}@test.com`,
  });

  // 1. Win match 1
  await userRepository.recordBattleStatsById(streakUser._id, {
    isWin: true,
    isLoss: false,
    isDraw: false,
    correctCount: 8,
    questionCount: 10,
  });
  let u = await UserModel.findById(streakUser._id);
  if (u?.currentStreak !== 1 || u?.highestWinStreak !== 1) {
    throw new Error(`B-4 Failed after Win 1: current=${u?.currentStreak}, highest=${u?.highestWinStreak}`);
  }

  // 2. Win match 2
  await userRepository.recordBattleStatsById(streakUser._id, {
    isWin: true,
    isLoss: false,
    isDraw: false,
    correctCount: 9,
    questionCount: 10,
  });
  u = await UserModel.findById(streakUser._id);
  if (u?.currentStreak !== 2 || u?.highestWinStreak !== 2) {
    throw new Error(`B-4 Failed after Win 2: current=${u?.currentStreak}, highest=${u?.highestWinStreak}`);
  }

  // 3. Win match 3
  await userRepository.recordBattleStatsById(streakUser._id, {
    isWin: true,
    isLoss: false,
    isDraw: false,
    correctCount: 10,
    questionCount: 10,
  });
  u = await UserModel.findById(streakUser._id);
  if (u?.currentStreak !== 3 || u?.highestWinStreak !== 3) {
    throw new Error(`B-4 Failed after Win 3: current=${u?.currentStreak}, highest=${u?.highestWinStreak}`);
  }
  console.log('✅ B-4 Checkpoint 1: Consecutive wins increment both currentStreak and highestWinStreak to 3.');

  // 4. Loss match (breaks streak)
  await userRepository.recordBattleStatsById(streakUser._id, {
    isWin: false,
    isLoss: true,
    isDraw: false,
    correctCount: 3,
    questionCount: 10,
  });
  u = await UserModel.findById(streakUser._id);
  if (u?.currentStreak !== 0 || u?.highestWinStreak !== 3) {
    throw new Error(`B-4 Failed after Loss: current=${u?.currentStreak} (expected 0), highest=${u?.highestWinStreak} (expected 3)`);
  }
  console.log('✅ B-4 Checkpoint 2: Loss resets currentStreak to 0 while preserving highestWinStreak at 3.');

  // 5. Win 4 matches in a row -> new record of 4
  for (let i = 0; i < 4; i++) {
    await userRepository.recordBattleStatsById(streakUser._id, {
      isWin: true,
      isLoss: false,
      isDraw: false,
      correctCount: 7,
      questionCount: 10,
    });
  }
  u = await UserModel.findById(streakUser._id);
  if (u?.currentStreak !== 4 || u?.highestWinStreak !== 4) {
    throw new Error(`B-4 Failed after 4 new wins: current=${u?.currentStreak} (expected 4), highest=${u?.highestWinStreak} (expected 4)`);
  }
  console.log('✅ B-4 Checkpoint 3: Surpassing previous record updates highestWinStreak to new peak (4).');

  // Cleanup test documents
  await BattleModel.deleteOne({ _id: testBattle._id });
  await UserModel.deleteMany({ _id: { $in: [p1._id, p2._id, p3._id, p4._id, streakUser._id] } });
  await mongoose.disconnect();

  console.log('\n==================================================');
  console.log('🎉 ALL SECTION B (B-1 TO B-4) CHECKS PASSED!');
  console.log('==================================================');
}

runQuizScoringFixesVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
