import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { QuestionModel } from '../modules/question/question.model.js';
import { UserModel } from '../modules/user/user.model.js';
import { RoomModel } from '../modules/room/room.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { roomService } from '../modules/room/room.service.js';
import { battleService } from '../modules/battle/battle.service.js';
import { historyService } from '../modules/history/history.service.js';
import { getCategoryTimeLimit } from '../shared/config/quiz-config.js';
import { ApiError } from '../shared/errors/api-error.js';
import { RoomStatus } from '../modules/room/room.types.js';
import { BattleStatus } from '../modules/battle/battle.types.js';

async function runSoloVerification() {
  console.log('====================================================');
  console.log('🧪 Fix Group 5: Dedicated Solo Quiz Flow Verification');
  console.log('====================================================\n');

  await connectDatabase();

  try {
    // 1. Setup Test Users: Authenticated User & Guest User
    console.log('▶️ Setting up Test Users (Native & Guest)...');
    let authUser = await UserModel.findOne({ email: 'solo_tester@codearena.com' });
    if (!authUser) {
      authUser = await UserModel.create({
        username: 'solo_tester',
        email: 'solo_tester@codearena.com',
        displayName: 'Solo Quiz Champion',
        isGuest: false,
      });
    }

    let guestUser = await UserModel.findOne({ username: 'guest_solo_tester' });
    if (!guestUser) {
      guestUser = await UserModel.create({
        username: 'guest_solo_tester',
        displayName: 'Guest Player',
        isGuest: true,
      });
    }

    const authUserId = authUser._id.toString();
    const guestUserId = guestUser._id.toString();
    console.log('  Authenticated & Guest users verified ✅');

    // 2. Test Solo + Programming (Timer: 30s)
    console.log('\n▶️ Test 1: Solo + Programming (30s Category Timer)');
    const progSolo = await roomService.createSoloQuiz(authUserId, {
      categoryId: 'programming',
      questionCount: 10,
    });
    if (progSolo.room.settings.timeLimit !== 30 || progSolo.battle.timePerQuestion !== 30) {
      throw new Error(`Expected 30s timer for programming, got room: ${progSolo.room.settings.timeLimit}, battle: ${progSolo.battle.timePerQuestion}`);
    }
    if (progSolo.room.status !== RoomStatus.IN_PROGRESS || progSolo.battle.status !== BattleStatus.IN_PROGRESS) {
      throw new Error(`Expected room and battle to be immediately IN_PROGRESS, got room: ${progSolo.room.status}, battle: ${progSolo.battle.status}`);
    }
    if (progSolo.room.players.length !== 1 || progSolo.battle.players.length !== 1) {
      throw new Error(`Expected 1 player, got room: ${progSolo.room.players.length}, battle: ${progSolo.battle.players.length}`);
    }
    console.log(`  Programming solo quiz started immediately (Room: ${progSolo.room.roomCode}, Timer: ${progSolo.battle.timePerQuestion}s) ✅`);

    // 3. Test Solo + Aptitude (Timer: 60s)
    console.log('\n▶️ Test 2: Solo + Aptitude (60s Category Timer)');
    const aptSolo = await roomService.createSoloQuiz(authUserId, {
      categoryId: 'aptitude',
      questionCount: 10,
    });
    if (aptSolo.room.settings.timeLimit !== 60 || aptSolo.battle.timePerQuestion !== 60) {
      throw new Error(`Expected 60s timer for aptitude, got room: ${aptSolo.room.settings.timeLimit}, battle: ${aptSolo.battle.timePerQuestion}`);
    }
    console.log(`  Aptitude solo quiz started immediately with 60s timer (Room: ${aptSolo.room.roomCode}) ✅`);

    // 4. Test Solo + General Knowledge (Timer: 30s)
    console.log('\n▶️ Test 3: Solo + General Knowledge (30s Category Timer)');
    // Seed temporary GK questions for testing if not enough exist
    const gkCategory = await CategoryModel.findOne({ slug: 'general-knowledge' });
    const gkSubject = await SubjectModel.findOne({ categoryId: gkCategory?._id });
    const gkCount = await QuestionModel.countDocuments({ categoryId: gkCategory?._id, isPublished: true });
    const createdGkIds: string[] = [];

    if (gkCount < 10 && gkCategory && gkSubject) {
      console.log(`  Seeding ${10 - gkCount} temporary GK questions for timer test...`);
      for (let i = 0; i < 10 - gkCount; i++) {
        const qId = `temp_gk_test_${Date.now()}_${i}`;
        await QuestionModel.create({
          questionId: qId,
          categoryId: gkCategory._id,
          subjectId: gkSubject._id,
          difficulty: 'easy',
          question: `Sample GK Question ${i + 1}`,
          options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: 0,
          explanation: 'Sample GK explanation',
          isPublished: true,
        });
        createdGkIds.push(qId);
      }
    }

    const gkSolo = await roomService.createSoloQuiz(authUserId, {
      categoryId: 'general-knowledge',
      questionCount: 10,
    });
    if (gkSolo.room.settings.timeLimit !== 30 || gkSolo.battle.timePerQuestion !== 30) {
      throw new Error(`Expected 30s timer for general knowledge, got room: ${gkSolo.room.settings.timeLimit}, battle: ${gkSolo.battle.timePerQuestion}`);
    }
    console.log(`  General Knowledge solo quiz started immediately with 30s timer (Room: ${gkSolo.room.roomCode}) ✅`);

    // Clean up temporary GK questions
    if (createdGkIds.length > 0) {
      await QuestionModel.deleteMany({ questionId: { $in: createdGkIds } });
    }

    // 5. Test Solo + Specific Subject
    console.log('\n▶️ Test 4: Solo + Specific Subject');
    const subjSolo = await roomService.createSoloQuiz(authUserId, {
      categoryId: 'programming',
      subjectId: 'javascript',
      questionCount: 10,
    });
    if (subjSolo.room.settings.subjectId !== 'javascript') {
      throw new Error(`Expected subjectId 'javascript', got ${subjSolo.room.settings.subjectId}`);
    }
    console.log(`  Subject-specific solo quiz started (Subject: ${subjSolo.room.settings.subjectId}) ✅`);

    // 6. Test Solo + Mixed Category Mode
    console.log('\n▶️ Test 5: Solo + Mixed Category Mode');
    const mixedSolo = await roomService.createSoloQuiz(authUserId, {
      categoryId: 'programming',
      isMixedCategory: true,
      questionCount: 10,
    });
    if (!mixedSolo.room.settings.isMixedCategory) {
      throw new Error('Expected isMixedCategory to be true');
    }
    console.log(`  Mixed mode solo quiz started (Mixed: true, Qs: ${mixedSolo.battle.questionCount}) ✅`);

    // 7. Test Question Counts: 10, 15, 20
    console.log('\n▶️ Test 6, 7, 8: Question Counts (10, 15, 20 Qs)');
    for (const count of [10, 15, 20]) {
      const qSolo = await roomService.createSoloQuiz(authUserId, {
        categoryId: 'programming',
        questionCount: count,
      });
      if (qSolo.battle.questionCount !== count) {
        throw new Error(`Expected questionCount ${count}, got ${qSolo.battle.questionCount}`);
      }
      if (qSolo.battle.players[0].assignedQuestionIds.length !== count) {
        throw new Error(`Expected ${count} assigned questions, got ${qSolo.battle.players[0].assignedQuestionIds.length}`);
      }
      // Check question uniqueness
      const uniqueIds = new Set(qSolo.battle.players[0].assignedQuestionIds);
      if (uniqueIds.size !== count) {
        throw new Error(`Questions are not unique! Set size: ${uniqueIds.size}, expected: ${count}`);
      }
      console.log(`  Solo quiz with ${count} unique questions verified ✅`);
    }

    // 8. Test Guest User Solo Quiz
    console.log('\n▶️ Test 9: Guest User Solo Quiz');
    const guestSolo = await roomService.createSoloQuiz(guestUserId, {
      categoryId: 'programming',
      questionCount: 10,
    });
    const hostIdStr = (guestSolo.room.hostId as any)._id
      ? (guestSolo.room.hostId as any)._id.toString()
      : guestSolo.room.hostId.toString();
    if (hostIdStr !== guestUserId) {
      throw new Error(`Expected guest hostId ${guestUserId}, got ${hostIdStr}`);
    }
    console.log(`  Guest user successfully started solo quiz (Room: ${guestSolo.room.roomCode}) ✅`);

    // 9. Test Insufficient Question Pool Rejection
    console.log('\n▶️ Test 10: Insufficient Question Pool Rejection');
    try {
      await roomService.createSoloQuiz(authUserId, {
        categoryId: 'programming',
        subjectId: 'python', // Python has 15 questions in seed
        questionCount: 20, // Requesting 20 should fail with 400!
      });
      throw new Error('Should have failed due to insufficient questions in subject');
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 400 && err.message.includes('Not enough published questions')) {
        console.log(`  Gracefully rejected insufficient questions request with 400: "${err.message}" ✅`);
      } else {
        throw err;
      }
    }

    // 10. Test Anti-Cheat: Secret Answers are NOT exposed in battle:init
    console.log('\n▶️ Test 11: Anti-Cheat Question Exposure Check');
    const initPayload = await battleService.getBattleInitPayload(progSolo.battle, authUserId);
    if (!initPayload) {
      throw new Error('Failed to generate battle init payload');
    }
    if ((initPayload.currentQuestion as any).correctAnswer !== undefined) {
      throw new Error('CRITICAL SECURITY VIOLATION: correctAnswer is exposed in currentQuestion init payload!');
    }
    console.log('  Anti-cheat verified: Question payload sanitization hides correct answers ✅');

    // 11. Test Solo Gameplay: Answer submission, reveal, and completion
    console.log('\n▶️ Test 12: Solo Gameplay, Scoring, and Finalization');
    const question1Id = initPayload.currentQuestion.questionId;
    const answerResult = await battleService.submitAnswer(
      authUserId,
      progSolo.room.roomCode,
      question1Id,
      1 // option index
    );
    if (typeof answerResult.potentialScore !== 'number' || answerResult.potentialScore <= 0) {
      throw new Error(`Invalid potentialScore: ${answerResult.potentialScore}`);
    }
    console.log(`  Answer submitted authoritatively (Score awarded: ${answerResult.potentialScore} pts) ✅`);

    // Complete the battle and check results
    const finalized = await battleService.finalizeBattle(progSolo.battle);
    if (finalized.players.length !== 1) {
      throw new Error(`Expected 1 player in finalized results, got ${finalized.players.length}`);
    }
    if (!finalized.rankings || finalized.rankings[0]?.rank !== 1) {
      throw new Error(`Expected rank 1 for solo player, got ${finalized.rankings?.[0]?.rank}`);
    }
    console.log(`  Battle finalized: Player rank: #${finalized.rankings[0].rank}, Score: ${finalized.rankings[0].totalScore} pts ✅`);

    // 12. Test History Service Output for Solo Quiz
    console.log('\n▶️ Test 13: History & Report Card Contract for Solo Quiz');
    const historyDetails = await historyService.getBattleResults(progSolo.battle._id.toString(), authUserId);
    if (historyDetails.result !== 'COMPLETED') {
      throw new Error(`Expected solo result 'COMPLETED', got '${historyDetails.result}'`);
    }
    if (historyDetails.opponentPlayer !== null) {
      throw new Error('Expected opponentPlayer to be null for solo quiz');
    }
    console.log(`  History verified: result='${historyDetails.result}', opponentPlayer=null ✅`);

    // 13. Multiplayer Regression Check
    console.log('\n▶️ Test 14: Multiplayer Regression Check (1–4 Players)');
    // Test 1-player multiplayer lobby
    const mp1 = await roomService.createRoom(authUserId, { categoryId: 'programming', questionCount: 10 });
    if (mp1.status !== RoomStatus.WAITING || mp1.maxPlayers !== 4) {
      throw new Error(`Expected multiplayer room to be WAITING with maxPlayers 4, got status: ${mp1.status}, maxPlayers: ${mp1.maxPlayers}`);
    }

    // Join 2nd player to lobby
    await roomService.joinRoom(guestUserId, mp1.roomCode);
    const updatedMp1 = await roomService.getRoom(mp1.roomCode);
    if (updatedMp1.players.length !== 2) {
      throw new Error(`Expected 2 players in multiplayer lobby, got ${updatedMp1.players.length}`);
    }

    // Set ready and start battle
    await roomService.updateReadyStatus(guestUserId, mp1.roomCode, true);
    const mpBattle = await battleService.startBattle(authUserId, mp1.roomCode);
    if (mpBattle.players.length !== 2) {
      throw new Error(`Expected 2 players in multiplayer battle, got ${mpBattle.players.length}`);
    }
    console.log(`  Multiplayer room flow intact: 2 players joined lobby, marked ready, and battle started (Room: ${mp1.roomCode}) ✅`);

    console.log('\n====================================================');
    console.log('🎉 ALL 14 SOLO QUIZ & MULTIPLAYER TESTS PASSED PERFECTLY!');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Verification Failed:', error);
    process.exit(1);
  }
}

runSoloVerification();
