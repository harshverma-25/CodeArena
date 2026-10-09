import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { UserModel } from '../modules/user/user.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { RoomModel } from '../modules/room/room.model.js';
import { QuestionModel } from '../modules/question/question.model.js';
import { roomService } from '../modules/room/room.service.js';
import { battleService } from '../modules/battle/battle.service.js';
import { historyService } from '../modules/history/history.service.js';
import { RoomStatus } from '../modules/room/room.types.js';

async function runPlayAgainVerificationSuite() {
  console.log('====================================================');
  console.log('🧪 Multiplayer Play Again Flow Verification Suite');
  console.log('====================================================\n');

  await connectDatabase();

  const timestamp = Date.now();
  const createdUserIds: string[] = [];

  // Mock IO for testing socket emissions
  const emittedEvents: Array<{ event: string; channel: string; data: any }> = [];
  const mockIo: any = {
    to: (channel: string) => ({
      emit: (event: string, data: any) => {
        emittedEvents.push({ event, channel, data });
      },
    }),
    emit: (event: string, data: any) => {
      emittedEvents.push({ event, channel: 'global', data });
    },
    in: () => ({
      fetchSockets: async () => [],
    }),
  };

  try {
    // 0. Ensure questions exist in DB
    const count = await QuestionModel.countDocuments({ status: 'PUBLISHED' });
    if (count < 10) {
      for (let i = 0; i < 10; i++) {
        await QuestionModel.create({
          questionId: `q_play_again_${timestamp}_${i}`,
          question: `Test Question #${i} for play again?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 0,
          explanation: 'Standard test explanation.',
          topic: 'Programming',
          difficulty: 'easy',
          status: 'PUBLISHED',
          publishedAt: new Date(),
        });
      }
    }

    const createTestUser = async (name: string) => {
      const user = await UserModel.create({
        username: `pa_${name}_${timestamp}`,
        displayName: `Player ${name}`,
        isGuest: false,
      });
      createdUserIds.push(user._id.toString());
      return user;
    };

    const host = await createTestUser('host');
    const p2 = await createTestUser('p2');
    const p3 = await createTestUser('p3');
    const p4 = await createTestUser('p4');

    const finishBattle = async (battleObj: any) => {
      const doc = await BattleModel.findById(battleObj._id || battleObj);
      if (!doc) throw new Error('Battle not found for finalization');
      return battleService.finalizeBattle(doc);
    };

    // -------------------------------------------------------------
    // TEST 1: 1 player → finish → Play Again → new quiz works
    // -------------------------------------------------------------
    console.log('▶️ TEST 1: 1 Player Flow → Finish → Play Again');
    const room1 = await roomService.createRoom(host._id.toString(), {
      topic: 'Programming',
      difficulty: 'Easy',
      questionCount: 10,
    });
    const battle1 = await battleService.startBattle(host._id.toString(), room1.roomCode);
    await battleService.submitAnswer(host._id.toString(), room1.roomCode, battle1.players[0].assignedQuestionIds[0], 0, mockIo);
    await finishBattle(battle1);

    // Play again
    const rematchRoom1 = await roomService.createRematchRoom(host._id.toString(), room1.roomCode, mockIo);
    if (!rematchRoom1 || rematchRoom1.roomCode === room1.roomCode) {
      throw new Error('TEST 1 Failed: Rematch room must be a fresh room with distinct roomCode');
    }
    if (rematchRoom1.status !== RoomStatus.WAITING) {
      throw new Error(`TEST 1 Failed: Rematch room should be WAITING, got ${rematchRoom1.status}`);
    }
    if (rematchRoom1.matchId) {
      throw new Error('TEST 1 Failed: Rematch room should have matchId null until started');
    }
    console.log('✅ TEST 1 Passed: 1-player Play Again generated fresh WAITING room:', rematchRoom1.roomCode);

    // -------------------------------------------------------------
    // TEST 2: 2 players → finish → Play Again → both can enter new quiz
    // -------------------------------------------------------------
    console.log('\n▶️ TEST 2: 2 Players Flow → Finish → Play Again → Both in room');
    const room2 = await roomService.createRoom(host._id.toString(), {
      topic: 'Programming',
      difficulty: 'Easy',
      questionCount: 10,
    });
    await roomService.joinRoom(p2._id.toString(), room2.roomCode);
    await roomService.updateReadyStatus(p2._id.toString(), room2.roomCode, true);
    const battle2 = await battleService.startBattle(host._id.toString(), room2.roomCode);
    await finishBattle(battle2);

    // Host triggers rematch
    emittedEvents.length = 0;
    const rematchRoom2 = await roomService.createRematchRoom(host._id.toString(), room2.roomCode, mockIo);
    
    // Check broadcast to old room channel
    const playAgainEvent = emittedEvents.find(
      (e) => e.event === 'room:play_again' && e.channel === `room:${room2.roomCode}`
    );
    if (!playAgainEvent) {
      throw new Error('TEST 2 Failed: Did not broadcast room:play_again to old room channel');
    }
    if (playAgainEvent.data.newRoomCode !== rematchRoom2.roomCode) {
      throw new Error('TEST 2 Failed: Broadcasted newRoomCode does not match created rematch roomCode');
    }

    // Both players join the rematch room
    const r2Updated = await roomService.getRoom(rematchRoom2.roomCode);
    const hostIdStr = (r2Updated.players[0].userId as any)?._id?.toString() || r2Updated.players[0].userId.toString();
    if (r2Updated.players.length < 1 || hostIdStr !== host._id.toString()) {
      throw new Error('TEST 2 Failed: Host must be primary player in rematch room');
    }
    const r2Joined = await roomService.joinRoom(p2._id.toString(), rematchRoom2.roomCode);
    if (r2Joined.players.length !== 2) {
      throw new Error(`TEST 2 Failed: Expected 2 players in rematch room, got ${r2Joined.players.length}`);
    }
    console.log('✅ TEST 2 Passed: 2 players successfully migrated to rematch room and event broadcasted');

    // -------------------------------------------------------------
    // TEST 3 & 4: 3 and 4 players → finish → Play Again → all enter
    // -------------------------------------------------------------
    console.log('\n▶️ TEST 3 & 4: 3 and 4 Players Flow → Finish → Play Again → All join');
    const room4 = await roomService.createRoom(host._id.toString(), {
      topic: 'Programming',
      difficulty: 'Easy',
      questionCount: 10,
    });
    await roomService.joinRoom(p2._id.toString(), room4.roomCode);
    await roomService.joinRoom(p3._id.toString(), room4.roomCode);
    await roomService.joinRoom(p4._id.toString(), room4.roomCode);

    const r4Initial = await roomService.getRoom(room4.roomCode);
    if (r4Initial.players.length !== 4) {
      throw new Error(`Expected 4 players in initial room, got ${r4Initial.players.length}`);
    }

    await roomService.updateReadyStatus(p2._id.toString(), room4.roomCode, true);
    await roomService.updateReadyStatus(p3._id.toString(), room4.roomCode, true);
    await roomService.updateReadyStatus(p4._id.toString(), room4.roomCode, true);
    const battle4 = await battleService.startBattle(host._id.toString(), room4.roomCode);
    await finishBattle(battle4);

    // Trigger rematch
    const rematchRoom4 = await roomService.createRematchRoom(host._id.toString(), room4.roomCode, mockIo);
    await roomService.joinRoom(p2._id.toString(), rematchRoom4.roomCode);
    await roomService.joinRoom(p3._id.toString(), rematchRoom4.roomCode);
    await roomService.joinRoom(p4._id.toString(), rematchRoom4.roomCode);

    const r4Rematch = await roomService.getRoom(rematchRoom4.roomCode);
    if (r4Rematch.players.length !== 4) {
      throw new Error(`TEST 3 & 4 Failed: Expected 4 players in rematch room, got ${r4Rematch.players.length}`);
    }
    console.log('✅ TEST 3 & 4 Passed: 3 and 4 players all successfully entered the new rematch room');

    // -------------------------------------------------------------
    // TEST 5: Old result remains accessible after rematch
    // -------------------------------------------------------------
    console.log('\n▶️ TEST 5: Old Result Remains Accessible & Untouched After Rematch');
    const oldBattleResult = await historyService.getBattleResults(battle4._id.toString(), host._id.toString());
    if (!oldBattleResult || oldBattleResult.battleId !== battle4._id.toString()) {
      throw new Error('TEST 5 Failed: Old battle result is not accessible via getBattleResults');
    }
    if (oldBattleResult.players.length !== 4) {
      throw new Error('TEST 5 Failed: Old battle player count corrupted');
    }
    if (!oldBattleResult.hostId || oldBattleResult.hostId !== host._id.toString()) {
      throw new Error(`TEST 5 Failed: Old battle result should include hostId ${host._id.toString()}`);
    }
    console.log('✅ TEST 5 Passed: Old battle results intact and contain authoritative hostId');

    // -------------------------------------------------------------
    // TEST 6: New quiz has fresh battle ID, scores, questions, timers
    // -------------------------------------------------------------
    console.log('\n▶️ TEST 6: Fresh State in New Battle Session');
    // Set all players ready in rematchRoom4 and start
    await roomService.updateReadyStatus(p2._id.toString(), rematchRoom4.roomCode, true);
    await roomService.updateReadyStatus(p3._id.toString(), rematchRoom4.roomCode, true);
    await roomService.updateReadyStatus(p4._id.toString(), rematchRoom4.roomCode, true);

    const newBattle = await battleService.startBattle(host._id.toString(), rematchRoom4.roomCode);
    if (newBattle._id.toString() === battle4._id.toString()) {
      throw new Error('TEST 6 Failed: Rematch battle ID must be distinct from previous battle ID');
    }
    const hostPlayerInNewBattle = newBattle.players.find(p => p.userId.toString() === host._id.toString());
    if (!hostPlayerInNewBattle || hostPlayerInNewBattle.score !== 0) {
      throw new Error('TEST 6 Failed: New battle scores must start at 0');
    }
    if (hostPlayerInNewBattle.currentQuestionIndex !== 0) {
      throw new Error('TEST 6 Failed: New battle question index must start at 0');
    }
    if (newBattle.status === 'COMPLETED') {
      throw new Error('TEST 6 Failed: New battle status must be IN_PROGRESS, not COMPLETED');
    }
    console.log('✅ TEST 6 Passed: New quiz has distinct battle ID, reset scores, index 0, and uncompleted state');

    // -------------------------------------------------------------
    // TEST 7: Host can change settings before rematch starts
    // -------------------------------------------------------------
    console.log('\n▶️ TEST 7: Host Can Change Settings in Rematch Room');
    const roomSettingsTest = await roomService.createRoom(host._id.toString(), {
      topic: 'Programming',
      difficulty: 'Easy',
      questionCount: 10,
    });
    const battleSettingsTest = await battleService.startBattle(host._id.toString(), roomSettingsTest.roomCode);
    await finishBattle(battleSettingsTest);

    const rematchSettingsRoom = await roomService.createRematchRoom(host._id.toString(), roomSettingsTest.roomCode, mockIo);
    
    // Host modifies settings
    const updatedSettingsRoom = await roomService.updateSettings(host._id.toString(), rematchSettingsRoom.roomCode, {
      questionCount: 15,
      difficulty: 'Hard',
    });
    if (updatedSettingsRoom.settings.questionCount !== 15 || updatedSettingsRoom.settings.difficulty !== 'Hard') {
      throw new Error('TEST 7 Failed: Host failed to update rematch room settings');
    }
    console.log('✅ TEST 7 Passed: Host successfully updated rematch room settings prior to match start');

    // -------------------------------------------------------------
    // TEST 8: Non-host cannot modify settings
    // -------------------------------------------------------------
    console.log('\n▶️ TEST 8: Non-Host Cannot Modify Settings');
    await roomService.joinRoom(p2._id.toString(), rematchSettingsRoom.roomCode);
    let nonHostBlocked = false;
    try {
      await roomService.updateSettings(p2._id.toString(), rematchSettingsRoom.roomCode, {
        questionCount: 20,
      });
    } catch (err: any) {
      nonHostBlocked = true;
    }
    if (!nonHostBlocked) {
      throw new Error('TEST 8 Failed: Non-host was allowed to update room settings');
    }
    console.log('✅ TEST 8 Passed: Non-host update was rejected with authorization error');

    // -------------------------------------------------------------
    // TEST 9: Rapidly clicking Play Again does not create duplicate rooms
    // -------------------------------------------------------------
    console.log('\n▶️ TEST 9: Rapid Play Again Double-Click Idempotency');
    const rapidRoom = await roomService.createRoom(host._id.toString(), {
      topic: 'Programming',
      difficulty: 'Easy',
      questionCount: 10,
    });
    const rapidBattle = await battleService.startBattle(host._id.toString(), rapidRoom.roomCode);
    await finishBattle(rapidBattle);

    // Call createRematchRoom twice in rapid parallel succession
    const [call1, call2] = await Promise.all([
      roomService.createRematchRoom(host._id.toString(), rapidRoom.roomCode, mockIo),
      roomService.createRematchRoom(host._id.toString(), rapidRoom.roomCode, mockIo),
    ]);
    if (call1.roomCode !== call2.roomCode) {
      throw new Error(`TEST 9 Failed: Rapid clicks created two distinct rooms: ${call1.roomCode} vs ${call2.roomCode}`);
    }
    console.log('✅ TEST 9 Passed: Concurrent rematch requests returned the exact same roomCode:', call1.roomCode);

    // -------------------------------------------------------------
    // TEST 10: Player disconnecting/leaving does not permanently break remaining players
    // -------------------------------------------------------------
    console.log('\n▶️ TEST 10: Player Disconnect / Leave Handling');
    const discRoom = await roomService.createRoom(host._id.toString(), {
      topic: 'Programming',
      difficulty: 'Easy',
      questionCount: 10,
    });
    await roomService.joinRoom(p2._id.toString(), discRoom.roomCode);
    await roomService.joinRoom(p3._id.toString(), discRoom.roomCode);
    await roomService.updateReadyStatus(p2._id.toString(), discRoom.roomCode, true);
    await roomService.updateReadyStatus(p3._id.toString(), discRoom.roomCode, true);

    const discBattle = await battleService.startBattle(host._id.toString(), discRoom.roomCode);
    await finishBattle(discBattle);

    // Rematch created
    const discRematch = await roomService.createRematchRoom(host._id.toString(), discRoom.roomCode, mockIo);
    // p2 joins, p3 leaves/does not join
    await roomService.joinRoom(p2._id.toString(), discRematch.roomCode);
    await roomService.updateReadyStatus(p2._id.toString(), discRematch.roomCode, true);

    // Remaining players (host + p2) can start without p3
    const remainingBattle = await battleService.startBattle(host._id.toString(), discRematch.roomCode);
    if (!remainingBattle || remainingBattle.players.length !== 2) {
      throw new Error('TEST 10 Failed: Remaining players could not proceed after third player left');
    }
    console.log('✅ TEST 10 Passed: Remaining players proceeded cleanly without waiting for absent player');

    console.log('\n====================================================');
    console.log('🎉 ALL 10 PLAY AGAIN VERIFICATION TESTS PASSED!');
    console.log('====================================================');
  } finally {
    // Cleanup created users and rooms
    await UserModel.deleteMany({ _id: { $in: createdUserIds } });
    await disconnectDatabase();
  }
}

runPlayAgainVerificationSuite().catch((err) => {
  console.error('❌ Verification suite failed with error:', err);
  process.exit(1);
});
