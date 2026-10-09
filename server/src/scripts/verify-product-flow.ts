import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../modules/user/user.model.js';
import { RoomModel } from '../modules/room/room.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { QuestionModel } from '../modules/question/question.model.js';
import { roomService } from '../modules/room/room.service.js';
import { battleService } from '../modules/battle/battle.service.js';
import { historyService } from '../modules/history/history.service.js';
import { authService } from '../modules/auth/auth.service.js';

async function runEndToEndProductFlowVerification() {
  console.log('====================================================');
  console.log('🚀 Phase 7: End-to-End Product Flow & UX Verification');
  console.log('====================================================\n');

  await connectDatabase();

  const timestamp = Date.now();
  let createdUserIds: string[] = [];

  try {
    // 0. Fetch or seed Categories & Subjects
    const programmingCat = await CategoryModel.findOne({ slug: 'programming' });
    const aptitudeCat = await CategoryModel.findOne({ slug: 'aptitude' });

    if (!programmingCat || !aptitudeCat) {
      throw new Error('Categories not found. Please ensure DB is seeded.');
    }

    const dsaSubject = await SubjectModel.findOne({ categoryId: programmingCat._id, slug: 'dsa' });
    const quantSubject = await SubjectModel.findOne({ categoryId: aptitudeCat._id, slug: 'quantitative-aptitude' });

    // Seed sufficient questions if needed
    const ensureQuestions = async (catId: any, subId: any, count: number) => {
      const existing = await QuestionModel.countDocuments({ categoryId: catId, status: 'PUBLISHED' });
      if (existing < count) {
        const toCreate = [];
        for (let i = 0; i < count - existing; i++) {
          toCreate.push({
            questionId: `flow_q_${catId}_${Date.now()}_${i}`,
            question: `Flow Test Question ${i + 1}`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            explanation: 'Option A is correct by definition.',
            topic: 'FlowTest',
            difficulty: 'easy',
            status: 'PUBLISHED',
            categoryId: catId,
            subjectId: subId,
            publishedAt: new Date(),
          });
        }
        await QuestionModel.insertMany(toCreate);
      }
    };

    await ensureQuestions(programmingCat._id, dsaSubject?._id, 20);
    await ensureQuestions(aptitudeCat._id, quantSubject?._id, 10);

    // Create a registered user
    const regUser = await UserModel.create({
      username: `reg_${timestamp}`,
      displayName: 'Registered Champion',
      email: `reg_${timestamp}@codearena.test`,
      passwordHash: 'dummyhash',
      isGuest: false,
    });
    createdUserIds.push(regUser._id.toString());

    // Create a guest user via authService
    const guestSession = await authService.createGuestSession(`Guest_${timestamp.toString().slice(-4)}`);
    const guestUser = guestSession.user;
    createdUserIds.push(guestUser._id.toString());

    // Additional players for 2, 3, 4 multiplayer tests
    const p2 = await UserModel.create({ username: `p2_${timestamp}`, displayName: 'Player Two', isGuest: false });
    const p3 = await UserModel.create({ username: `p3_${timestamp}`, displayName: 'Player Three', isGuest: false });
    const p4 = await UserModel.create({ username: `p4_${timestamp}`, displayName: 'Player Four', isGuest: false });
    createdUserIds.push(p2._id.toString(), p3._id.toString(), p4._id.toString());

    // -------------------------------------------------------------
    // Scenario 1: Registered user creates Category -> Subject room (10 questions)
    // -------------------------------------------------------------
    console.log('▶️ Scenario 1: Registered user creates Category -> Subject -> 10 questions');
    const room1 = await roomService.createRoom(regUser._id.toString(), {
      topic: 'DSA',
      categoryId: programmingCat._id.toString(),
      subjectId: dsaSubject?._id.toString(),
      questionCount: 10,
    });
    if (room1.settings.questionCount !== 10 || room1.settings.timeLimit !== 30 || room1.settings.isMixedCategory) {
      throw new Error('Scenario 1 Failed: Room settings do not match expected configuration');
    }
    console.log(`  Room Code: ${room1.roomCode}, Category: Programming (30s), Count: 10 ✅`);

    // -------------------------------------------------------------
    // Scenario 2: Registered user creates Category -> Mixed room (15 questions)
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 2: Registered user creates Category -> Mixed -> 15 questions');
    const room2 = await roomService.createRoom(regUser._id.toString(), {
      topic: 'Programming Mixed',
      categoryId: programmingCat._id.toString(),
      isMixedCategory: true,
      questionCount: 15,
    });
    if (room2.settings.questionCount !== 15 || !room2.settings.isMixedCategory) {
      throw new Error('Scenario 2 Failed: Mixed category room settings mismatch');
    }
    console.log(`  Room Code: ${room2.roomCode}, Mixed: true, Count: 15 ✅`);

    // -------------------------------------------------------------
    // Scenario 3: Guest creates Category -> Subject room
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 3: Guest creates Category -> Subject room');
    const room3 = await roomService.createRoom(guestUser._id.toString(), {
      topic: 'DSA',
      categoryId: programmingCat._id.toString(),
      subjectId: dsaSubject?._id.toString(),
      questionCount: 10,
    });
    const roomHostId = (room3.hostId as any)?._id?.toString() || room3.hostId?.toString();
    if (roomHostId !== guestUser._id.toString()) {
      throw new Error(`Scenario 3 Failed: Guest is not set as room host (got ${roomHostId}, expected ${guestUser._id})`);
    }
    console.log(`  Guest Room Code: ${room3.roomCode}, Host: ${guestUser.displayName} ✅`);

    // -------------------------------------------------------------
    // Scenario 4: Guest creates Category -> Mixed room
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 4: Guest creates Category -> Mixed room');
    const room4 = await roomService.createRoom(guestUser._id.toString(), {
      topic: 'Aptitude Mixed',
      categoryId: aptitudeCat._id.toString(),
      isMixedCategory: true,
      questionCount: 10,
    });
    if (!room4.settings.isMixedCategory || room4.settings.timeLimit !== 60) {
      throw new Error('Scenario 4 Failed: Aptitude mixed room timer should be 60s');
    }
    console.log(`  Guest Mixed Room: ${room4.roomCode}, Timer: 60s ✅`);

    // -------------------------------------------------------------
    // Scenario 5: Guest joins room via PIN lookup
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 5: Guest joins room via PIN lookup');
    const lookupRoom = await roomService.getRoom(room1.roomCode);
    if (!lookupRoom) throw new Error('Scenario 5 Failed: PIN lookup returned null');
    const joinedRoom = await roomService.joinRoom(guestUser._id.toString(), lookupRoom.roomCode);
    const hasGuest = joinedRoom.players.some((p: any) => (p.userId?._id?.toString() || p.userId?.toString()) === guestUser._id.toString());
    if (!hasGuest) throw new Error('Scenario 5 Failed: Guest not found in joined room');
    console.log(`  Guest successfully joined room ${room1.roomCode} via PIN ✅`);

    // -------------------------------------------------------------
    // Scenario 6: 1-Player Solo Quiz completes cleanly end-to-end
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 6: 1-Player Solo Quiz lifecycle');
    const soloRoom = await roomService.createRoom(regUser._id.toString(), {
      topic: 'DSA Solo',
      categoryId: programmingCat._id.toString(),
      subjectId: dsaSubject?._id.toString(),
      questionCount: 10,
    });
    const soloBattle = await battleService.startBattle(regUser._id.toString(), soloRoom.roomCode);
    if (soloBattle.players.length !== 1) throw new Error('Scenario 6 Failed: Solo battle does not have exactly 1 player');
    
    // Submit answer
    const subRes = await battleService.submitAnswer(
      regUser._id.toString(),
      soloRoom.roomCode,
      soloBattle.players[0].assignedQuestionIds[0],
      0 // selectedOption (seeded questions have correctAnswer: 0)
    );
    if (subRes.potentialScore <= 0) throw new Error('Scenario 6 Failed: Solo submission earned 0 points');
    
    // Complete battle
    await battleService.executeRoundReveal(soloBattle._id.toString(), soloRoom.roomCode, { to: () => ({ emit: () => {} }) } as any);
    const finalSoloDoc = await battleService.getBattleById(soloBattle._id.toString());
    await battleService.finalizeBattle(finalSoloDoc!);
    const soloResults = await historyService.getBattleResults(soloBattle._id.toString(), regUser._id.toString());
    if (soloResults.players.length !== 1 || soloResults.winnerId !== regUser._id.toString()) {
      throw new Error('Scenario 6 Failed: Solo results validation failed');
    }
    console.log(`  Solo Quiz complete. Winner: ${soloResults.userPlayer.displayName} (${soloResults.userPlayer.score} pts) ✅`);

    // -------------------------------------------------------------
    // Scenario 7: 2-Player Multiplayer Quiz completes cleanly
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 7: 2-Player Multiplayer Quiz');
    const room2p = await roomService.createRoom(regUser._id.toString(), {
      topic: 'DSA 2P',
      categoryId: programmingCat._id.toString(),
      subjectId: dsaSubject?._id.toString(),
      questionCount: 10,
    });
    await roomService.joinRoom(p2._id.toString(), room2p.roomCode);
    await roomService.updateReadyStatus(p2._id.toString(), room2p.roomCode, true);
    const battle2p = await battleService.startBattle(regUser._id.toString(), room2p.roomCode);
    if (battle2p.players.length !== 2) throw new Error('Scenario 7 Failed: 2P battle player count mismatch');
    
    // P1 answers correct immediately, P2 answers after short delay
    await battleService.submitAnswer(regUser._id.toString(), room2p.roomCode, battle2p.players[0].assignedQuestionIds[0], 0);
    await new Promise((r) => setTimeout(r, 100));
    await battleService.submitAnswer(p2._id.toString(), room2p.roomCode, battle2p.players[1].assignedQuestionIds[0], 0);
    await battleService.executeRoundReveal(battle2p._id.toString(), room2p.roomCode, { to: () => ({ emit: () => {} }) } as any);
    const finalDoc2p = await battleService.getBattleById(battle2p._id.toString());
    await battleService.finalizeBattle(finalDoc2p!);
    
    const results2p = await historyService.getBattleResults(battle2p._id.toString(), regUser._id.toString());
    if (results2p.players[0].score <= results2p.players[1].score) {
      throw new Error('Scenario 7 Failed: Faster player should have higher score');
    }
    console.log(`  2-Player Quiz complete. 1st: ${results2p.players[0].displayName}, 2nd: ${results2p.players[1].displayName} ✅`);

    // -------------------------------------------------------------
    // Scenario 8: 3-Player Multiplayer Quiz completes cleanly
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 8: 3-Player Multiplayer Quiz');
    const room3p = await roomService.createRoom(regUser._id.toString(), {
      topic: 'DSA 3P',
      categoryId: programmingCat._id.toString(),
      subjectId: dsaSubject?._id.toString(),
      questionCount: 10,
    });
    await roomService.joinRoom(p2._id.toString(), room3p.roomCode);
    await roomService.joinRoom(p3._id.toString(), room3p.roomCode);
    await roomService.updateReadyStatus(p2._id.toString(), room3p.roomCode, true);
    await roomService.updateReadyStatus(p3._id.toString(), room3p.roomCode, true);
    const battle3p = await battleService.startBattle(regUser._id.toString(), room3p.roomCode);
    if (battle3p.players.length !== 3) throw new Error('Scenario 8 Failed: 3P battle player count mismatch');
    const finalDoc3p = await battleService.getBattleById(battle3p._id.toString());
    await battleService.finalizeBattle(finalDoc3p!);
    const results3p = await historyService.getBattleResults(battle3p._id.toString(), regUser._id.toString());
    if (results3p.players.length !== 3) throw new Error('Scenario 8 Failed: Results players length != 3');
    console.log(`  3-Player Quiz complete with 3 podium placements ✅`);

    // -------------------------------------------------------------
    // Scenario 9: 4-Player Multiplayer Quiz completes cleanly
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 9: 4-Player Multiplayer Quiz');
    const room4p = await roomService.createRoom(regUser._id.toString(), {
      topic: 'DSA 4P',
      categoryId: programmingCat._id.toString(),
      subjectId: dsaSubject?._id.toString(),
      questionCount: 10,
    });
    await roomService.joinRoom(p2._id.toString(), room4p.roomCode);
    await roomService.joinRoom(p3._id.toString(), room4p.roomCode);
    await roomService.joinRoom(p4._id.toString(), room4p.roomCode);
    await roomService.updateReadyStatus(p2._id.toString(), room4p.roomCode, true);
    await roomService.updateReadyStatus(p3._id.toString(), room4p.roomCode, true);
    await roomService.updateReadyStatus(p4._id.toString(), room4p.roomCode, true);
    const battle4p = await battleService.startBattle(regUser._id.toString(), room4p.roomCode);
    if (battle4p.players.length !== 4) throw new Error('Scenario 9 Failed: 4P battle player count mismatch');
    
    // Scoring setup:
    // P1: correct immediately -> highest score (~1000)
    // P2: correct after delay -> 2nd score (~997)
    // P3: incorrect (option 1) -> 0 pts
    // P4: timed out / no answer -> 0 pts
    await battleService.submitAnswer(regUser._id.toString(), room4p.roomCode, battle4p.players[0].assignedQuestionIds[0], 0);
    await new Promise((r) => setTimeout(r, 100));
    await battleService.submitAnswer(p2._id.toString(), room4p.roomCode, battle4p.players[1].assignedQuestionIds[0], 0);
    await battleService.submitAnswer(p3._id.toString(), room4p.roomCode, battle4p.players[2].assignedQuestionIds[0], 1);
    await battleService.executeRoundReveal(battle4p._id.toString(), room4p.roomCode, { to: () => ({ emit: () => {} }) } as any);
    const finalDoc4p = await battleService.getBattleById(battle4p._id.toString());
    await battleService.finalizeBattle(finalDoc4p!);

    // -------------------------------------------------------------
    // Scenario 10: Correct timer enforced by category (30s vs 60s)
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 10: Category Timer Enforcement (Programming 30s vs Aptitude 60s)');
    const progRoom = await roomService.createRoom(regUser._id.toString(), {
      topic: 'Prog Timer Test',
      categoryId: programmingCat._id.toString(),
      questionCount: 10,
    });
    const aptRoom = await roomService.createRoom(regUser._id.toString(), {
      topic: 'Apt Timer Test',
      categoryId: aptitudeCat._id.toString(),
      questionCount: 10,
    });
    if (progRoom.settings.timeLimit !== 30) throw new Error('Scenario 10 Failed: Programming timer is not 30s');
    if (aptRoom.settings.timeLimit !== 60) throw new Error('Scenario 10 Failed: Aptitude timer is not 60s');
    console.log(`  Programming: ${progRoom.settings.timeLimit}s, Aptitude: ${aptRoom.settings.timeLimit}s ✅`);

    // -------------------------------------------------------------
    // Scenario 11: Results screen rankings & tie-breaking for 1-4 players
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 11: Authoritative Rankings & Tie-Breaking in Battle Results');
    const results4p = await historyService.getBattleResults(battle4p._id.toString(), regUser._id.toString());
    if (!results4p.rankings || results4p.rankings.length !== 4) {
      throw new Error('Scenario 11 Failed: rankings array missing or length != 4');
    }
    const r1 = results4p.rankings[0];
    const r2 = results4p.rankings[1];
    const r3 = results4p.rankings[2];
    const r4 = results4p.rankings[3];

    if (r1.rank !== 1 || r2.rank !== 2) {
      throw new Error(`Scenario 11 Failed: Rank 1 or 2 incorrect: ${r1.rank}, ${r2.rank}`);
    }
    // r3 and r4 both have 0 points, so they should share rank 3
    if (r3.rank !== 3 || r4.rank !== 3) {
      throw new Error(`Scenario 11 Failed: Tied players should share rank 3, got: ${r3.rank}, ${r4.rank}`);
    }
    if (!results4p.categoryId || results4p.timePerQuestion !== 30) {
      throw new Error('Scenario 11 Failed: Results metadata (categoryId, timePerQuestion) missing');
    }
    console.log(`  Rankings verified: Rank 1 (${r1.totalScore} pts), Rank 2 (${r2.totalScore} pts), Rank 3 Tied (${r3.totalScore} & ${r4.totalScore} pts) ✅`);

    // -------------------------------------------------------------
    // Scenario 12: Play Again flow works from results metadata
    // -------------------------------------------------------------
    console.log('\n▶️ Scenario 12: Play Again flow creates matching room');
    const rematchRoom = await roomService.createRoom(regUser._id.toString(), {
      topic: results4p.topic,
      categoryId: results4p.categoryId,
      subjectId: results4p.subjectId || undefined,
      isMixedCategory: results4p.isMixedCategory,
      questionCount: results4p.questionCount,
    });
    if (
      rematchRoom.settings.categoryId?.toString() !== results4p.categoryId?.toString() ||
      rematchRoom.settings.questionCount !== results4p.questionCount ||
      rematchRoom.settings.timeLimit !== results4p.timePerQuestion
    ) {
      throw new Error('Scenario 12 Failed: Play Again room settings do not match previous quiz');
    }
    console.log(`  Rematch room created successfully: ${rematchRoom.roomCode} matching all previous settings ✅`);

    console.log('\n====================================================');
    console.log('🎉 ALL 12 END-TO-END PRODUCT FLOW SCENARIOS PASSED!');
    console.log('====================================================\n');
  } finally {
    // Cleanup created test users, rooms, and battles
    try {
      if (createdUserIds.length > 0) {
        await UserModel.deleteMany({ _id: { $in: createdUserIds } });
        await RoomModel.deleteMany({ host: { $in: createdUserIds } });
        await BattleModel.deleteMany({ 'players.userId': { $in: createdUserIds } });
      }
    } catch (cleanupErr) {
      console.warn('Cleanup warning:', cleanupErr);
    }
    await disconnectDatabase();
  }
}

runEndToEndProductFlowVerification().catch((err) => {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
});
