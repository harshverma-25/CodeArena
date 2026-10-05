import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../modules/user/user.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { RoomModel } from '../modules/room/room.model.js';
import { historyService } from '../modules/history/history.service.js';
import { userService } from '../modules/user/user.service.js';

async function runHistoryProfileVerificationSuite() {
  console.log('====================================================');
  console.log('🧪 Fix Group 4: History & Profile Verification Suite');
  console.log('====================================================\n');

  await connectDatabase();

  const timestamp = Date.now();
  const createdUserIds: string[] = [];

  const createTestUser = async (name: string) => {
    const user = await UserModel.create({
      clerkId: `clerk_hp_${name}_${timestamp}`,
      username: `hp_${name}_${timestamp}`,
      displayName: `Player ${name}`,
      email: `hp_${name}_${timestamp}@test.local`,
      passwordHash: 'dummy_hash',
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
    });
    createdUserIds.push(user._id.toString());
    return user;
  };

  try {
    const userA = await createTestUser('A');
    const userB = await createTestUser('B');
    const userC = await createTestUser('C');
    const userD = await createTestUser('D');

    console.log('✅ Created 4 test users: A, B, C, D\n');

    // ----------------------------------------------------
    // CASE 1: Solo Quiz (1 player)
    // ----------------------------------------------------
    console.log('--- CASE 1: Solo Quiz (1 player) ---');
    const roomSolo = await RoomModel.create({
      roomCode: `SOLO_${timestamp.toString().slice(-4)}`,
      hostId: userA._id,
      players: [{ userId: userA._id, isHost: true, isReady: true }],
      settings: {
        categoryId: 'programming',
        subjectId: 'dsa',
        isMixedCategory: false,
        duration: 10,
        questionCount: 5,
      },
      status: 'FINISHED',
    });

    const battleSolo = await BattleModel.create({
      roomId: roomSolo._id,
      roomCode: roomSolo.roomCode,
      topic: 'DSA Basics',
      difficulty: 'medium',
      questionCount: 5,
      timePerQuestion: 30,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 60000),
      endedAt: new Date(),
      winnerId: userA._id,
      players: [
        {
          userId: userA._id,
          score: 1500,
          answers: [
            { questionId: 'q1', selectedOption: 1, isCorrect: true, timeTakenMs: 1200 },
            { questionId: 'q2', selectedOption: 2, isCorrect: true, timeTakenMs: 1500 },
            { questionId: 'q3', selectedOption: 0, isCorrect: false, timeTakenMs: 2000 },
            { questionId: 'q4', selectedOption: 3, isCorrect: true, timeTakenMs: 1800 },
            { questionId: 'q5', selectedOption: 1, isCorrect: true, timeTakenMs: 1100 },
          ],
        },
      ],
    });

    const historySolo = await historyService.getMatchHistory(userA._id.toString(), { page: 1, limit: 10 });
    const soloMatch = historySolo.matches.find((m) => m._id === battleSolo._id.toString());

    if (!soloMatch) throw new Error('Solo quiz match not found in user history');
    if (soloMatch.totalPlayers !== 1) throw new Error(`Expected totalPlayers=1, got ${soloMatch.totalPlayers}`);
    if (soloMatch.userRank !== 1) throw new Error(`Expected userRank=1, got ${soloMatch.userRank}`);
    if (soloMatch.userScore !== 1500) throw new Error(`Expected userScore=1500, got ${soloMatch.userScore}`);
    if (soloMatch.userAccuracy !== 80) throw new Error(`Expected userAccuracy=80, got ${soloMatch.userAccuracy}`);
    if (soloMatch.result !== 'COMPLETED') throw new Error(`Expected result='COMPLETED', got ${soloMatch.result}`);
    if (soloMatch.rankings.length !== 1) throw new Error(`Expected 1 ranking item, got ${soloMatch.rankings.length}`);

    const detailsSolo = await historyService.getBattleResults(battleSolo._id.toString(), userA._id.toString());
    if (detailsSolo.result !== 'COMPLETED') throw new Error(`Expected details.result='COMPLETED', got ${detailsSolo.result}`);
    if (detailsSolo.totalPlayers !== 1) throw new Error(`Expected details.totalPlayers=1, got ${detailsSolo.totalPlayers}`);
    if (detailsSolo.userRank !== 1) throw new Error(`Expected details.userRank=1, got ${detailsSolo.userRank}`);
    console.log('✅ Solo quiz verified: result=COMPLETED, totalPlayers=1, userRank=1, rankings length=1\n');

    // ----------------------------------------------------
    // CASE 2: 2-Player Quiz
    // ----------------------------------------------------
    console.log('--- CASE 2: 2-Player Quiz ---');
    const room2P = await RoomModel.create({
      roomCode: `2P_${timestamp.toString().slice(-4)}`,
      hostId: userA._id,
      players: [
        { userId: userA._id, isHost: true, isReady: true },
        { userId: userB._id, isHost: false, isReady: true },
      ],
      settings: {
        categoryId: 'programming',
        subjectId: 'javascript',
        isMixedCategory: false,
        duration: 10,
        questionCount: 5,
      },
      status: 'FINISHED',
    });

    const battle2P = await BattleModel.create({
      roomId: room2P._id,
      roomCode: room2P.roomCode,
      topic: 'JavaScript Fundamentals',
      difficulty: 'easy',
      questionCount: 5,
      timePerQuestion: 30,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 50000),
      endedAt: new Date(),
      winnerId: userA._id,
      players: [
        {
          userId: userA._id,
          score: 2000,
          answers: [
            { questionId: 'q1', selectedOption: 0, isCorrect: true, timeTakenMs: 1000 },
            { questionId: 'q2', selectedOption: 1, isCorrect: true, timeTakenMs: 1000 },
          ],
        },
        {
          userId: userB._id,
          score: 1200,
          answers: [
            { questionId: 'q1', selectedOption: 2, isCorrect: false, timeTakenMs: 1500 },
            { questionId: 'q2', selectedOption: 1, isCorrect: true, timeTakenMs: 1200 },
          ],
        },
      ],
    });

    const history2P_A = await historyService.getMatchHistory(userA._id.toString(), { page: 1, limit: 10 });
    const match2P_A = history2P_A.matches.find((m) => m._id === battle2P._id.toString());
    if (!match2P_A) throw new Error('2P match not found for User A');
    if (match2P_A.userRank !== 1) throw new Error(`Expected User A rank=1, got ${match2P_A.userRank}`);
    if (match2P_A.totalPlayers !== 2) throw new Error(`Expected totalPlayers=2, got ${match2P_A.totalPlayers}`);
    if (match2P_A.result !== 'VICTORY') throw new Error(`Expected User A result=VICTORY, got ${match2P_A.result}`);

    const history2P_B = await historyService.getMatchHistory(userB._id.toString(), { page: 1, limit: 10 });
    const match2P_B = history2P_B.matches.find((m) => m._id === battle2P._id.toString());
    if (!match2P_B) throw new Error('2P match not found for User B');
    if (match2P_B.userRank !== 2) throw new Error(`Expected User B rank=2, got ${match2P_B.userRank}`);
    if (match2P_B.result !== 'DEFEAT') throw new Error(`Expected User B result=DEFEAT, got ${match2P_B.result}`);
    console.log('✅ 2-Player quiz verified: User A rank #1 (VICTORY), User B rank #2 (DEFEAT)\n');

    // ----------------------------------------------------
    // CASE 3: 3-Player Quiz
    // ----------------------------------------------------
    console.log('--- CASE 3: 3-Player Quiz ---');
    const room3P = await RoomModel.create({
      roomCode: `3P_${timestamp.toString().slice(-4)}`,
      hostId: userA._id,
      players: [
        { userId: userA._id, isHost: true, isReady: true },
        { userId: userB._id, isHost: false, isReady: true },
        { userId: userC._id, isHost: false, isReady: true },
      ],
      settings: {
        categoryId: 'aptitude',
        subjectId: null,
        isMixedCategory: true,
        duration: 15,
        questionCount: 10,
      },
      status: 'FINISHED',
    });

    const battle3P = await BattleModel.create({
      roomId: room3P._id,
      roomCode: room3P.roomCode,
      topic: 'Mixed Aptitude',
      difficulty: 'medium',
      questionCount: 10,
      timePerQuestion: 60,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 120000),
      endedAt: new Date(),
      winnerId: userB._id,
      players: [
        {
          userId: userB._id,
          score: 3000,
          answers: [{ questionId: 'q1', selectedOption: 0, isCorrect: true, timeTakenMs: 1000 }],
        },
        {
          userId: userA._id,
          score: 2500,
          answers: [{ questionId: 'q1', selectedOption: 0, isCorrect: true, timeTakenMs: 1200 }],
        },
        {
          userId: userC._id,
          score: 1800,
          answers: [{ questionId: 'q1', selectedOption: 1, isCorrect: false, timeTakenMs: 1400 }],
        },
      ],
    });

    const history3P_A = await historyService.getMatchHistory(userA._id.toString(), { page: 1, limit: 10 });
    const match3P_A = history3P_A.matches.find((m) => m._id === battle3P._id.toString());
    if (!match3P_A) throw new Error('3P match not found for User A');
    if (match3P_A.totalPlayers !== 3) throw new Error(`Expected totalPlayers=3, got ${match3P_A.totalPlayers}`);
    if (match3P_A.userRank !== 2) throw new Error(`Expected User A rank=2, got ${match3P_A.userRank}`);
    if (match3P_A.rankings.length !== 3) throw new Error(`Expected 3 rankings, got ${match3P_A.rankings.length}`);

    // Verify ordering in rankings
    if (match3P_A.rankings[0].userId !== userB._id.toString() || match3P_A.rankings[0].rank !== 1) {
      throw new Error('Ranking #1 should be User B');
    }
    if (match3P_A.rankings[1].userId !== userA._id.toString() || match3P_A.rankings[1].rank !== 2) {
      throw new Error('Ranking #2 should be User A');
    }
    if (match3P_A.rankings[2].userId !== userC._id.toString() || match3P_A.rankings[2].rank !== 3) {
      throw new Error('Ranking #3 should be User C');
    }
    console.log('✅ 3-Player quiz verified: User B #1, User A #2, User C #3 across all 3 participants\n');

    // ----------------------------------------------------
    // CASE 4: 4-Player Quiz
    // ----------------------------------------------------
    console.log('--- CASE 4: 4-Player Quiz ---');
    const room4P = await RoomModel.create({
      roomCode: `4P_${timestamp.toString().slice(-4)}`,
      hostId: userA._id,
      players: [
        { userId: userA._id, isHost: true, isReady: true },
        { userId: userB._id, isHost: false, isReady: true },
        { userId: userC._id, isHost: false, isReady: true },
        { userId: userD._id, isHost: false, isReady: true },
      ],
      settings: {
        categoryId: 'gk',
        subjectId: 'general',
        isMixedCategory: false,
        duration: 15,
        questionCount: 15,
      },
      status: 'FINISHED',
    });

    const battle4P = await BattleModel.create({
      roomId: room4P._id,
      roomCode: room4P.roomCode,
      topic: 'General Knowledge',
      difficulty: 'hard',
      questionCount: 15,
      timePerQuestion: 30,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 180000),
      endedAt: new Date(),
      winnerId: userD._id,
      players: [
        {
          userId: userD._id,
          score: 4200,
          answers: [],
        },
        {
          userId: userA._id,
          score: 3500,
          answers: [],
        },
        {
          userId: userC._id,
          score: 2800,
          answers: [],
        },
        {
          userId: userB._id,
          score: 1900,
          answers: [],
        },
      ],
    });

    for (const [usr, expectedRank, expectedScore] of [
      [userD, 1, 4200],
      [userA, 2, 3500],
      [userC, 3, 2800],
      [userB, 4, 1900],
    ] as const) {
      const h = await historyService.getMatchHistory(usr._id.toString(), { page: 1, limit: 10 });
      const m = h.matches.find((x) => x._id === battle4P._id.toString());
      if (!m) throw new Error(`4P match not found for user ${usr.displayName}`);
      if (m.totalPlayers !== 4) throw new Error(`Expected totalPlayers=4, got ${m.totalPlayers}`);
      if (m.userRank !== expectedRank) {
        throw new Error(`Expected user ${usr.displayName} rank=${expectedRank}, got ${m.userRank}`);
      }
      if (m.userScore !== expectedScore) {
        throw new Error(`Expected user ${usr.displayName} score=${expectedScore}, got ${m.userScore}`);
      }
      if (m.rankings.length !== 4) throw new Error(`Expected 4 rankings, got ${m.rankings.length}`);
    }
    console.log('✅ 4-Player quiz verified: User D #1, User A #2, User C #3, User B #4 all accurate\n');

    // ----------------------------------------------------
    // CASE 5: User Profile Statistics & Recent Quizzes
    // ----------------------------------------------------
    console.log('--- CASE 5: User Profile Statistics ---');
    const profileA = await userService.getUserProfileByUsername(userA.username, userA._id.toString());
    if (!profileA) throw new Error('User A profile not found');

    console.log('Profile A metrics:', {
      quizzesPlayed: profileA.quizzesPlayed,
      bestScore: profileA.bestScore,
      bestRank: profileA.bestRank,
      avgScore: profileA.avgScore,
      recentBattlesCount: profileA.recentBattles.length,
    });

    if (profileA.quizzesPlayed !== 4) {
      throw new Error(`Expected quizzesPlayed=4, got ${profileA.quizzesPlayed}`);
    }
    if (profileA.bestScore !== 3500) {
      throw new Error(`Expected bestScore=3500, got ${profileA.bestScore}`);
    }
    if (profileA.bestRank !== 1) {
      throw new Error(`Expected bestRank=1, got ${profileA.bestRank}`);
    }

    // Verify recent battles array in profile contains multiplayer metadata
    for (const b of profileA.recentBattles) {
      if (b.userRank === undefined) throw new Error(`Expected userRank in profile recent battle ${b._id}`);
      if (b.totalPlayers === undefined) throw new Error(`Expected totalPlayers in profile recent battle ${b._id}`);
      if (!b.players || b.players.length === 0) {
        throw new Error(`Expected players array in profile recent battle ${b._id}`);
      }
    }
    console.log('✅ Profile metrics verified: quizzesPlayed, bestScore, bestRank, avgScore, and recentBattles metadata\n');

    // ----------------------------------------------------
    // CASE 6: Backward Compatibility (Legacy records)
    // ----------------------------------------------------
    console.log('--- CASE 6: Backward Compatibility with Legacy Match Record ---');
    const legacyBattle = await BattleModel.create({
      roomId: room2P._id,
      roomCode: `LEGACY_${timestamp.toString().slice(-4)}`,
      topic: 'Old Legacy Quiz',
      difficulty: 'medium',
      questionCount: 5,
      timePerQuestion: 30,
      status: 'COMPLETED',
      startedAt: new Date(Date.now() - 300000),
      endedAt: new Date(),
      winnerId: userA._id,
      players: [
        {
          userId: userA._id,
          score: 800,
          answers: [],
        },
        {
          userId: userB._id,
          score: 500,
          answers: [],
        },
      ],
    });

    const legacyHistory = await historyService.getMatchHistory(userA._id.toString(), { page: 1, limit: 10 });
    const legacyMatch = legacyHistory.matches.find((m) => m._id === legacyBattle._id.toString());
    if (!legacyMatch) throw new Error('Legacy match not found in history');
    if (legacyMatch.userRank !== 1) throw new Error(`Expected legacy userRank=1, got ${legacyMatch.userRank}`);
    if (legacyMatch.totalPlayers !== 2) throw new Error(`Expected legacy totalPlayers=2, got ${legacyMatch.totalPlayers}`);
    console.log('✅ Legacy battle record handled gracefully without crash\n');

    console.log('====================================================');
    console.log('🎉 ALL 6 VERIFICATION SUITES PASSED CLEANLY!');
    console.log('====================================================');
  } finally {
    // Cleanup created test records
    console.log('\n🧹 Cleaning up test records...');
    await UserModel.deleteMany({ _id: { $in: createdUserIds } });
    await BattleModel.deleteMany({ 'players.userId': { $in: createdUserIds } });
    await RoomModel.deleteMany({ hostId: { $in: createdUserIds } });
    await disconnectDatabase();
    console.log('✨ Cleanup complete.\n');
  }
}

runHistoryProfileVerificationSuite()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  });
