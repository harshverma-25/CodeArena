import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../modules/user/user.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { RoomModel } from '../modules/room/room.model.js';
import { BattleStatus } from '../modules/battle/battle.types.js';
import { userService } from '../modules/user/user.service.js';
import { battleService } from '../modules/battle/battle.service.js';
import { reconcileUserStats } from './reconcile-user-stats.js';

async function runTask21TestSuite() {
  console.log('====================================================');
  console.log('🧪 CodeArena Task 2.1 Optimization & Integrity Suite');
  console.log('====================================================\n');

  await connectDatabase();

  try {
    // Clean up any stale test artifacts from prior runs
    await UserModel.deleteMany({ username: { $regex: '^(sim_p|tb_|zero_user|guest_test)' } });

    // -------------------------------------------------------------
    // Test 1: Leaderboard Pagination & Index-Driven Projection
    // -------------------------------------------------------------
    console.log('▶️ Test 1: Leaderboard Pagination & Structure');
    const page1 = await userService.getLeaderboard({ page: 1, limit: 3 });
    const page2 = await userService.getLeaderboard({ page: 2, limit: 3 });

    if (page1.page !== 1 || page1.limit !== 3 || !Array.isArray(page1.leaderboard)) {
      throw new Error(`Invalid page1 response structure: ${JSON.stringify(page1)}`);
    }
    if (page2.page !== 2 || page2.limit !== 3 || !Array.isArray(page2.leaderboard)) {
      throw new Error(`Invalid page2 response structure: ${JSON.stringify(page2)}`);
    }
    if (page1.leaderboard.length > 0 && page1.leaderboard[0].rank !== 1) {
      throw new Error(`Rank of first entry on page 1 is not 1: ${page1.leaderboard[0].rank}`);
    }
    if (page2.leaderboard.length > 0 && page2.leaderboard[0].rank !== 4) {
      throw new Error(`Rank of first entry on page 2 is not 4: ${page2.leaderboard[0].rank}`);
    }
    console.log(`  Page 1: ${page1.leaderboard.length} entries, total: ${page1.total}`);
    console.log(`  Page 2: ${page2.leaderboard.length} entries, total: ${page2.total}`);
    console.log('  Pagination and 1-indexed ranks verified ✅\n');

    // -------------------------------------------------------------
    // Test 2: Guest User Exclusion from Leaderboard
    // -------------------------------------------------------------
    console.log('▶️ Test 2: Guest User Exclusion');
    // Create temporary guest in DB
    const guestUser = await UserModel.create({
      username: `guest_${Date.now()}`,
      displayName: 'Guest Player',
      isGuest: true,
      role: 'guest',
      wins: 999,
      matchesPlayed: 1000,
      accuracy: 100,
    });

    const lbWithGuest = await userService.getLeaderboard({ page: 1, limit: 100 });
    const guestInLb = lbWithGuest.leaderboard.some((p) => p.userId === guestUser._id.toString());
    const guestRank = await userService.calculateUserRank(guestUser);

    await UserModel.deleteOne({ _id: guestUser._id });

    if (guestInLb) {
      throw new Error('Guest was found on public leaderboard!');
    }
    if (guestRank !== 0) {
      throw new Error(`Guest user calculateUserRank returned ${guestRank} instead of 0`);
    }
    console.log('  Guests strictly excluded from leaderboard and rank = 0 ✅\n');

    // -------------------------------------------------------------
    // Test 3: Every Rank Tie-Break Rule Verification
    // -------------------------------------------------------------
    console.log('▶️ Test 3: Full Tie-Breaking Sequence Verification');
    // Create 4 deterministic test users to verify all 4 levels of sorting:
    // 1. wins (b.wins - a.wins)
    // 2. accuracy (b.accuracy - a.accuracy)
    // 3. matchesPlayed (b.matchesPlayed - a.matchesPlayed)
    // 4. username (a.username.localeCompare(b.username))
    const prefix = `tb_${Date.now()}`;
    const userA = await UserModel.create({
      username: `${prefix}_user_alpha`,
      displayName: 'Alpha',
      isGuest: false,
      wins: 10,
      accuracy: 80,
      matchesPlayed: 15,
    });
    const userB = await UserModel.create({
      username: `${prefix}_user_beta`,
      displayName: 'Beta',
      isGuest: false,
      wins: 10,
      accuracy: 75, // lower accuracy than alpha
      matchesPlayed: 20,
    });
    const userC = await UserModel.create({
      username: `${prefix}_user_charlie`,
      displayName: 'Charlie',
      isGuest: false,
      wins: 10,
      accuracy: 75, // same accuracy as beta
      matchesPlayed: 18, // lower matchesPlayed than beta
    });
    const userD1 = await UserModel.create({
      username: `${prefix}_user_delta_1`,
      displayName: 'Delta 1',
      isGuest: false,
      wins: 10,
      accuracy: 75,
      matchesPlayed: 18,
    });
    const userD2 = await UserModel.create({
      username: `${prefix}_user_delta_2`,
      displayName: 'Delta 2',
      isGuest: false,
      wins: 10,
      accuracy: 75,
      matchesPlayed: 18, // same stats as D1, username delta_1 < delta_2
    });

    try {
      const rankA = await userService.calculateUserRank(userA);
      const rankB = await userService.calculateUserRank(userB);
      const rankC = await userService.calculateUserRank(userC);
      const rankD1 = await userService.calculateUserRank(userD1);
      const rankD2 = await userService.calculateUserRank(userD2);

      console.log(`  Rank A (Wins 10, Acc 80%): ${rankA}`);
      console.log(`  Rank B (Wins 10, Acc 75%, Matches 20): ${rankB}`);
      console.log(`  Rank C (Wins 10, Acc 75%, Matches 18, charlie): ${rankC}`);
      console.log(`  Rank D1 (Wins 10, Acc 75%, Matches 18, delta_1): ${rankD1}`);
      console.log(`  Rank D2 (Wins 10, Acc 75%, Matches 18, delta_2): ${rankD2}`);

      if (!(rankA < rankB && rankB < rankC && rankC < rankD1 && rankD1 < rankD2)) {
        throw new Error(
          `Tie-breaking order mismatch! Expected A < B < C < D1 < D2, got: ${rankA}, ${rankB}, ${rankC}, ${rankD1}, ${rankD2}`
        );
      }
      console.log('  All 4 tie-break levels strictly respected and consistent ✅\n');
    } finally {
      await UserModel.deleteMany({
        _id: { $in: [userA._id, userB._id, userC._id, userD1._id, userD2._id] },
      });
    }

    // -------------------------------------------------------------
    // Test 4: Users with Zero Matches & Profile Retrieval
    // -------------------------------------------------------------
    console.log('▶️ Test 4: Zero Match Users & Fast Profile Retrieval');
    const zeroUser = await UserModel.create({
      username: `zero_user_${Date.now()}`,
      displayName: 'Zero Matches Player',
      isGuest: false,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      accuracy: 0,
    });

    try {
      const profile = await userService.getUserProfileByUsername(zeroUser.username);
      if (
        profile.battlesPlayed !== 0 ||
        profile.wins !== 0 ||
        profile.losses !== 0 ||
        profile.draws !== 0 ||
        profile.accuracy !== 0 ||
        profile.recentBattles.length !== 0
      ) {
        throw new Error(`Zero-match profile incorrect: ${JSON.stringify(profile)}`);
      }
      if (typeof profile.rank !== 'number' || profile.rank < 1) {
        throw new Error(`Invalid rank for zero-match user: ${profile.rank}`);
      }
      console.log(`  Zero-match user rank resolved to: #${profile.rank}, accuracy: ${profile.accuracy}%`);
      console.log('  Zero-match user profile correctly formatted ✅\n');
    } finally {
      await UserModel.deleteOne({ _id: zeroUser._id });
    }

    // -------------------------------------------------------------
    // Test 5: Atomic Battle Finalization & Idempotency
    // -------------------------------------------------------------
    console.log('▶️ Test 5: Atomic Battle Finalization & Idempotency');
    const p1 = await UserModel.create({
      username: `sim_p1_${Date.now()}`,
      displayName: 'Sim Player 1',
      isGuest: false,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      accuracy: 0,
    });
    const p2 = await UserModel.create({
      username: `sim_p2_${Date.now()}`,
      displayName: 'Sim Player 2',
      isGuest: false,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      totalCorrect: 0,
      totalQuestions: 0,
      accuracy: 0,
    });

    // Create a mock Room and Battle
    const mockRoom = await RoomModel.create({
      roomCode: `SIM_${Date.now().toString().slice(-5)}`,
      hostId: p1._id,
      players: [
        { userId: p1._id, isHost: true, isReady: true },
        { userId: p2._id, isHost: false, isReady: true },
      ],
      settings: {
        topic: 'javascript',
        difficulty: 'Medium',
        questionCount: 10,
      },
      status: 'IN_PROGRESS',
    });

    const mockBattle = await BattleModel.create({
      roomId: mockRoom._id,
      roomCode: mockRoom.roomCode,
      topic: 'javascript',
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 15,
      status: BattleStatus.IN_PROGRESS,
      players: [
        {
          userId: p1._id,
          assignedQuestionIds: ['q1', 'q2', 'q3', 'q4', 'q5'],
          currentQuestionIndex: 5,
          score: 4,
          status: 'COMPLETED',
          answers: [
            { questionId: 'q1', selectedOption: 1, isCorrect: true, submittedAt: new Date(), timeTakenMs: 1000 },
            { questionId: 'q2', selectedOption: 2, isCorrect: true, submittedAt: new Date(), timeTakenMs: 1000 },
            { questionId: 'q3', selectedOption: 0, isCorrect: true, submittedAt: new Date(), timeTakenMs: 1000 },
            { questionId: 'q4', selectedOption: 3, isCorrect: true, submittedAt: new Date(), timeTakenMs: 1000 },
            { questionId: 'q5', selectedOption: 0, isCorrect: false, submittedAt: new Date(), timeTakenMs: 1000 },
          ],
        },
        {
          userId: p2._id,
          assignedQuestionIds: ['q1', 'q2', 'q3', 'q4', 'q5'],
          currentQuestionIndex: 5,
          score: 2,
          status: 'COMPLETED',
          answers: [
            { questionId: 'q1', selectedOption: 1, isCorrect: true, submittedAt: new Date(), timeTakenMs: 1000 },
            { questionId: 'q2', selectedOption: 1, isCorrect: false, submittedAt: new Date(), timeTakenMs: 1000 },
            { questionId: 'q3', selectedOption: 0, isCorrect: true, submittedAt: new Date(), timeTakenMs: 1000 },
            { questionId: 'q4', selectedOption: 1, isCorrect: false, submittedAt: new Date(), timeTakenMs: 1000 },
            { questionId: 'q5', selectedOption: 2, isCorrect: false, submittedAt: new Date(), timeTakenMs: 1000 },
          ],
        },
      ],
    });

    try {
      // Simulate concurrent finalizeBattle calls simultaneously
      console.log('  Executing 5 simultaneous finalizeBattle calls against the same battle...');
      const results = await Promise.all([
        battleService.finalizeBattle(mockBattle),
        battleService.finalizeBattle(mockBattle),
        battleService.finalizeBattle(mockBattle),
        battleService.finalizeBattle(mockBattle),
        battleService.finalizeBattle(mockBattle),
      ]);

      // Verify all returned formatted results
      for (const res of results) {
        if (!res || !res.players || res.players.length !== 2) {
          throw new Error('Invalid results payload returned from simultaneous finalization');
        }
      }

      // Check player 1 and player 2 stats in database
      const updatedP1 = await UserModel.findById(p1._id).lean();
      const updatedP2 = await UserModel.findById(p2._id).lean();

      console.log(`  P1 (Winner) Matches: ${updatedP1?.matchesPlayed}, Wins: ${updatedP1?.wins}, Losses: ${updatedP1?.losses}, Acc: ${updatedP1?.accuracy}% (${updatedP1?.totalCorrect}/${updatedP1?.totalQuestions})`);
      console.log(`  P2 (Loser)  Matches: ${updatedP2?.matchesPlayed}, Wins: ${updatedP2?.wins}, Losses: ${updatedP2?.losses}, Acc: ${updatedP2?.accuracy}% (${updatedP2?.totalCorrect}/${updatedP2?.totalQuestions})`);

      if (updatedP1?.matchesPlayed !== 1 || updatedP1?.wins !== 1 || updatedP1?.losses !== 0) {
        throw new Error(`P1 stats double-incremented! matchesPlayed=${updatedP1?.matchesPlayed}, wins=${updatedP1?.wins}`);
      }
      if (updatedP2?.matchesPlayed !== 1 || updatedP2?.wins !== 0 || updatedP2?.losses !== 1) {
        throw new Error(`P2 stats double-incremented! matchesPlayed=${updatedP2?.matchesPlayed}, losses=${updatedP2?.losses}`);
      }
      if (updatedP1?.totalCorrect !== 4 || updatedP1?.totalQuestions !== 5 || updatedP1?.accuracy !== 80) {
        throw new Error(`P1 accuracy calculation mismatch: ${JSON.stringify(updatedP1)}`);
      }
      if (updatedP2?.totalCorrect !== 2 || updatedP2?.totalQuestions !== 5 || updatedP2?.accuracy !== 40) {
        throw new Error(`P2 accuracy calculation mismatch: ${JSON.stringify(updatedP2)}`);
      }

      console.log('  Atomic idempotency verified! Exactly 1 increment despite concurrent finalization ✅\n');
    } finally {
      await BattleModel.deleteOne({ _id: mockBattle._id });
      await RoomModel.deleteOne({ _id: mockRoom._id });
      await UserModel.deleteMany({ _id: { $in: [p1._id, p2._id] } });
    }

    // -------------------------------------------------------------
    // Test 6: Reconcile Dry-Run Functionality
    // -------------------------------------------------------------
    console.log('▶️ Test 6: Safe Reconciliation Dry-Run Validation');
    const dryRunDiffs = await reconcileUserStats(false);
    if (!Array.isArray(dryRunDiffs) || dryRunDiffs.length === 0) {
      throw new Error('Reconcile dry run returned empty or invalid diffs');
    }
    console.log(`  Reconciliation dry-run evaluated ${dryRunDiffs.length} users cleanly ✅\n`);

    console.log('====================================================');
    console.log('🎉 ALL TASK 2.1 INTEGRITY & OPTIMIZATION TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    await disconnectDatabase();
  }
}

runTask21TestSuite().catch((err) => {
  console.error('\n❌ Task 2.1 Test Suite Error:', err);
  process.exit(1);
});
