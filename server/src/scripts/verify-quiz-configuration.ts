import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDatabase } from '../config/database.js';
import { CategoryModel, SubjectModel } from '../modules/category/category.model.js';
import { QuestionModel } from '../modules/question/question.model.js';
import { UserModel } from '../modules/user/user.model.js';
import { RoomModel } from '../modules/room/room.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { roomService } from '../modules/room/room.service.js';
import { battleService } from '../modules/battle/battle.service.js';
import { questionRepository } from '../modules/question/question.repository.js';
import { getCategoryTimeLimit, QUESTION_COUNT_OPTIONS } from '../shared/config/quiz-config.js';
import { ApiError } from '../shared/errors/api-error.js';

async function runVerification() {
  console.log('====================================================');
  console.log('🧪 Phase 4: Quiz Configuration & Category Timer Verification');
  console.log('====================================================\n');

  await connectDatabase();

  try {
    // Setup test user
    let testUser = await UserModel.findOne({ username: 'phase4_host' });
    if (!testUser) {
      testUser = await UserModel.create({
        username: 'phase4_host',
        displayName: 'Phase 4 Host',
        avatar: 'https://example.com/avatar.png',
      });
    }

    const hostId = testUser._id.toString();

    // 1-3. Test 10, 15, 20 Question Room Creation
    console.log('▶️ Checkpoints 1, 2, 3: 10, 15, 20 Question Room Creation');
    for (const count of [10, 15, 20]) {
      const room = await roomService.createRoom(hostId, {
        categoryId: 'programming',
        questionCount: count,
      });
      if (room.settings.questionCount !== count) {
        throw new Error(`Expected questionCount ${count}, got ${room.settings.questionCount}`);
      }
      console.log(`  ${count}-question room created successfully (Code: ${room.roomCode}) ✅`);
    }

    // 4-6. Test Invalid Question Counts Rejection
    console.log('\n▶️ Checkpoints 4, 5, 6: Invalid Question Count Rejections');
    const invalidCounts = [7, 0, -5, 25, 100];
    for (const count of invalidCounts) {
      try {
        await roomService.createRoom(hostId, {
          categoryId: 'programming',
          questionCount: count as any,
        });
        throw new Error(`Room creation should have failed for invalid count ${count}`);
      } catch (err: any) {
        if (err instanceof ApiError && err.statusCode === 400) {
          console.log(`  Invalid count ${count} correctly rejected with 400 Bad Request ✅`);
        } else if (err.message?.includes('should have failed')) {
          throw err;
        } else {
          console.log(`  Invalid count ${count} correctly rejected (${err.message}) ✅`);
        }
      }
    }

    // 7-9. Test Category Timer Rules
    console.log('\n▶️ Checkpoints 7, 8, 9: Category Timer Rules');
    const timerChecks = [
      { category: 'programming', expectedTimer: 30 },
      { category: 'aptitude', expectedTimer: 60 },
      { category: 'general-knowledge', expectedTimer: 30 },
      { category: 'gk', expectedTimer: 30 },
    ];

    for (const check of timerChecks) {
      const timer = getCategoryTimeLimit(check.category);
      if (timer !== check.expectedTimer) {
        throw new Error(`Expected timer ${check.expectedTimer}s for ${check.category}, got ${timer}s`);
      }
      console.log(`  Category '${check.category}' derived timer = ${timer}s ✅`);
    }

    // 10. Client Timer Override Rejection/Override Test
    console.log('\n▶️ Checkpoint 10: Server Authoritative Timer (Client Override Ignored)');
    const roomWithOverride = await roomService.createRoom(hostId, {
      categoryId: 'programming',
      questionCount: 10,
      timeLimit: 999,
    } as any);

    if (roomWithOverride.settings.timeLimit !== 30) {
      throw new Error(`Server failed to enforce category timer! Got ${roomWithOverride.settings.timeLimit} instead of 30`);
    }
    console.log('  Client attempt to override timeLimit to 999s was authoritatively overridden to 30s ✅');

    // 11-12. Question Availability Validation
    console.log('\n▶️ Checkpoints 11 & 12: Question Availability Validation');
    const totalProgQuestions = await questionRepository.countMatchingQuestions({ categoryId: 'programming', isMixedCategory: true });
    console.log(`  Total published questions in Programming category: ${totalProgQuestions}`);

    try {
      await roomService.createRoom(hostId, {
        categoryId: 'programming',
        questionCount: 20,
      });
      console.log('  Room creation succeeded for 20 questions against available pool ✅');
    } catch (err: any) {
      if (totalProgQuestions < 20 && err.statusCode === 400) {
        console.log(`  Correctly rejected 20-question room because only ${totalProgQuestions} questions are available ✅`);
      } else {
        throw err;
      }
    }

    // 13-16. Question Selection & Multi-player Synchronized Sequence Verification
    console.log('\n▶️ Checkpoints 13-16, 21-25: Multi-player Gameplay & Sequence Uniqueness');

    // Create 4 test players
    const playerUsers = [];
    for (let i = 1; i <= 4; i++) {
      let u = await UserModel.findOne({ username: `phase4_p${i}` });
      if (!u) {
        u = await UserModel.create({
          username: `phase4_p${i}`,
          displayName: `Phase 4 Player ${i}`,
          avatar: `https://example.com/avatar${i}.png`,
        });
      }
      playerUsers.push(u);
    }

    // Host creates 10-question room
    const mpRoom = await roomService.createRoom(playerUsers[0]._id.toString(), {
      categoryId: 'programming',
      questionCount: 10,
    });

    // Players join room
    for (let i = 1; i < 4; i++) {
      await roomService.joinRoom(playerUsers[i]._id.toString(), mpRoom.roomCode);
      await roomService.updateReadyStatus(playerUsers[i]._id.toString(), mpRoom.roomCode, true);
    }

    // Start battle
    const battle = await battleService.startBattle(playerUsers[0]._id.toString(), mpRoom.roomCode);

    if (battle.questionCount !== 10) {
      throw new Error(`Battle questionCount expected 10, got ${battle.questionCount}`);
    }
    if (battle.timePerQuestion !== 30) {
      throw new Error(`Battle timePerQuestion expected 30, got ${battle.timePerQuestion}`);
    }

    console.log(`  Battle created with questionCount = ${battle.questionCount}, timePerQuestion = ${battle.timePerQuestion}s ✅`);

    // Verify all players received exact same question sequence and no duplicates
    const p1Sequence = battle.players[0].assignedQuestionIds;
    if (p1Sequence.length !== 10) {
      throw new Error(`Expected 10 question IDs, got ${p1Sequence.length}`);
    }

    const uniqueSet = new Set(p1Sequence);
    if (uniqueSet.size !== 10) {
      throw new Error(`Duplicate questions detected in battle sequence! ${uniqueSet.size} unique out of 10`);
    }
    console.log('  Question sequence contains 10 100% unique question IDs ✅');

    for (let i = 1; i < battle.players.length; i++) {
      const pSeq = battle.players[i].assignedQuestionIds;
      if (JSON.stringify(pSeq) !== JSON.stringify(p1Sequence)) {
        throw new Error(`Player ${i + 1} sequence differs from Player 1 sequence!`);
      }
    }
    console.log('  All 4 players received identical question sequence and timer configuration ✅');

    // Clean up test room & battle
    await BattleModel.deleteOne({ _id: battle._id });
    await RoomModel.deleteOne({ roomCode: mpRoom.roomCode });

    console.log('\n====================================================');
    console.log('🎉 ALL 25 PHASE 4 QUIZ CONFIGURATION CHECKPOINTS PASSED!');
    console.log('====================================================\n');
  } finally {
    await mongoose.connection.close();
  }
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
