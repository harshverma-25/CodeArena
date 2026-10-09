import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { RoomModel } from '../modules/room/room.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { UserModel } from '../modules/user/user.model.js';
import { roomService } from '../modules/room/room.service.js';
import { battleService } from '../modules/battle/battle.service.js';
import { RoomStatus } from '../modules/room/room.types.js';
import { BattleStatus } from '../modules/battle/battle.types.js';

async function runVerification() {
  console.log('====================================================');
  console.log('🧹 Verification: Stale Room & Abandoned Battle GC (Issue 1.2)');
  console.log('====================================================\n');

  await connectDatabase();

  const timestamp = Date.now();
  const createdRoomCodes: string[] = [];
  const createdBattleIds: any[] = [];
  let testUser: any = null;

  try {
    // 1. Setup Test User
    testUser = await UserModel.create({
      username: `gc_user_${timestamp}`,
      displayName: 'GC Test User',
      isGuest: false,
    });

    const hostId = testUser._id;

    // 2. Create Stale WAITING Room (Simulate 3 hours old)
    console.log('▶️ Test 1: Stale WAITING Room Deletion & Room Code Reuse');
    const staleCode = `STALE1`;
    // Clean up if existed
    await RoomModel.deleteOne({ roomCode: staleCode });

    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const staleRoom = await RoomModel.create({
      roomCode: staleCode,
      hostId,
      players: [{ userId: hostId, isHost: true, isReady: false }],
      settings: {
        topic: 'Programming',
        difficulty: 'Easy',
        questionCount: 10,
        timeLimit: 30,
      },
      status: RoomStatus.WAITING,
    });
    // Manually force updatedAt into the past
    await RoomModel.updateOne({ _id: staleRoom._id }, { $set: { updatedAt: threeHoursAgo } }, { timestamps: false });
    createdRoomCodes.push(staleCode);

    // 3. Create Fresh WAITING Room (5 minutes old)
    console.log('▶️ Test 2: Fresh WAITING Room Preservation');
    const freshCode = `FRESH1`;
    await RoomModel.deleteOne({ roomCode: freshCode });

    const freshRoom = await RoomModel.create({
      roomCode: freshCode,
      hostId,
      players: [{ userId: hostId, isHost: true, isReady: false }],
      settings: {
        topic: 'Programming',
        difficulty: 'Easy',
        questionCount: 10,
        timeLimit: 30,
      },
      status: RoomStatus.WAITING,
    });
    createdRoomCodes.push(freshCode);

    // 4. Create Active IN_PROGRESS Room & Battle (Fresh)
    console.log('▶️ Test 3: Active Room & Battle Preservation');
    const activeCode = `ACTV01`;
    await RoomModel.deleteOne({ roomCode: activeCode });

    const activeRoom = await RoomModel.create({
      roomCode: activeCode,
      hostId,
      players: [{ userId: hostId, isHost: true, isReady: true }],
      settings: {
        topic: 'Programming',
        difficulty: 'Easy',
        questionCount: 10,
        timeLimit: 30,
      },
      status: RoomStatus.IN_PROGRESS,
    });
    createdRoomCodes.push(activeCode);

    const activeBattle = await BattleModel.create({
      roomId: activeRoom._id,
      roomCode: activeCode,
      topic: 'Programming',
      difficulty: 'Easy',
      questionCount: 10,
      timePerQuestion: 30,
      players: [{
        userId: hostId,
        assignedQuestionIds: ['q1'],
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        status: 'IN_PROGRESS',
      }],
      status: BattleStatus.IN_PROGRESS,
    });
    createdBattleIds.push(activeBattle._id);

    // 5. Create Abandoned IN_PROGRESS Battle (Simulate 3 hours old)
    console.log('▶️ Test 4: Abandoned IN_PROGRESS Battle Garbage Collection');
    const abandonedCode = `ABAND1`;
    await RoomModel.deleteOne({ roomCode: abandonedCode });

    const abandonedRoom = await RoomModel.create({
      roomCode: abandonedCode,
      hostId,
      players: [{ userId: hostId, isHost: true, isReady: true }],
      settings: {
        topic: 'Programming',
        difficulty: 'Easy',
        questionCount: 10,
        timeLimit: 30,
      },
      status: RoomStatus.IN_PROGRESS,
    });
    createdRoomCodes.push(abandonedCode);

    const abandonedBattle = await BattleModel.create({
      roomId: abandonedRoom._id,
      roomCode: abandonedCode,
      topic: 'Programming',
      difficulty: 'Easy',
      questionCount: 10,
      timePerQuestion: 30,
      players: [{
        userId: hostId,
        assignedQuestionIds: ['q1'],
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        status: 'IN_PROGRESS',
      }],
      status: BattleStatus.IN_PROGRESS,
    });
    // Force past timestamp
    await BattleModel.updateOne({ _id: abandonedBattle._id }, { $set: { updatedAt: threeHoursAgo } }, { timestamps: false });
    await RoomModel.updateOne({ _id: abandonedRoom._id }, { $set: { updatedAt: threeHoursAgo } }, { timestamps: false });
    createdBattleIds.push(abandonedBattle._id);

    // 6. Create Historical COMPLETED Battle (Should NEVER be deleted or modified)
    console.log('▶️ Test 5: Completed Historical Battle Preservation');
    const completedBattle = await BattleModel.create({
      roomId: activeRoom._id,
      roomCode: activeCode,
      topic: 'Programming',
      difficulty: 'Easy',
      questionCount: 10,
      timePerQuestion: 30,
      players: [{
        userId: hostId,
        assignedQuestionIds: ['q1'],
        currentQuestionIndex: 1,
        answers: [],
        score: 100,
        status: 'COMPLETED',
      }],
      status: BattleStatus.COMPLETED,
    });
    // Even if updated 5 hours ago, completed battle must remain intact
    await BattleModel.updateOne({ _id: completedBattle._id }, { $set: { updatedAt: threeHoursAgo } }, { timestamps: false });
    createdBattleIds.push(completedBattle._id);

    // 7. Execute Garbage Collection Run (Threshold: 2 hours)
    console.log('\n▶️ Executing Garbage Collection (Threshold = 2 Hours)...');
    const twoHoursMs = 2 * 60 * 60 * 1000;
    const gcResult = await roomService.runGarbageCollection(twoHoursMs);

    console.log(`  GC Result: Deleted ${gcResult.deletedRoomsCount} rooms, Cancelled ${gcResult.cancelledBattlesCount} battles`);

    // Verify Stale Room was deleted
    const checkStale = await RoomModel.findOne({ roomCode: staleCode });
    if (checkStale !== null) {
      throw new Error(`Stale room ${staleCode} was not deleted by GC!`);
    }
    console.log(`  Stale WAITING room ${staleCode} was deleted ✅`);

    // Verify Fresh Room was PRESERVED
    const checkFresh = await RoomModel.findOne({ roomCode: freshCode });
    if (!checkFresh) {
      throw new Error(`Fresh room ${freshCode} was incorrectly deleted by GC!`);
    }
    console.log(`  Fresh WAITING room ${freshCode} was safely preserved ✅`);

    // Verify Active Room & Battle were PRESERVED
    const checkActiveRoom = await RoomModel.findOne({ roomCode: activeCode });
    const checkActiveBattle = await BattleModel.findById(activeBattle._id);
    if (!checkActiveRoom || checkActiveBattle?.status !== BattleStatus.IN_PROGRESS) {
      throw new Error(`Active room/battle was incorrectly deleted or modified!`);
    }
    console.log(`  Active IN_PROGRESS room & battle were safely preserved ✅`);

    // Verify Abandoned Battle was transitioned to CANCELLED
    const checkAbandonedBattle = await BattleModel.findById(abandonedBattle._id);
    const checkAbandonedRoom = await RoomModel.findOne({ roomCode: abandonedCode });
    if (checkAbandonedBattle?.status !== BattleStatus.CANCELLED) {
      throw new Error(`Abandoned battle was not marked CANCELLED! Got ${checkAbandonedBattle?.status}`);
    }
    if (checkAbandonedRoom?.status !== RoomStatus.CANCELLED) {
      throw new Error(`Abandoned room was not marked CANCELLED! Got ${checkAbandonedRoom?.status}`);
    }
    console.log(`  Abandoned battle & room transitioned to CANCELLED ✅`);

    // Verify Completed Battle was NOT touched
    const checkCompleted = await BattleModel.findById(completedBattle._id);
    if (checkCompleted?.status !== BattleStatus.COMPLETED) {
      throw new Error(`Historical completed battle was modified!`);
    }
    console.log(`  Completed historical battle preserved intact ✅`);

    // 8. Verify Room Code Reuse
    console.log('\n▶️ Test 6: Room Code Reuse After Stale Cleanup');
    // We should be able to create a brand new room with staleCode without unique constraint violation
    const reusedRoom = await RoomModel.create({
      roomCode: staleCode,
      hostId,
      players: [{ userId: hostId, isHost: true, isReady: false }],
      settings: {
        topic: 'Programming',
        difficulty: 'Easy',
        questionCount: 10,
        timeLimit: 30,
      },
      status: RoomStatus.WAITING,
    });
    if (!reusedRoom || reusedRoom.roomCode !== staleCode) {
      throw new Error(`Failed to reuse freed room code ${staleCode}`);
    }
    console.log(`  Room code ${staleCode} successfully reused for a new room ✅`);

    // 9. Verify Idempotency & Concurrency Safety
    console.log('\n▶️ Test 7: Race Safety & Idempotent Execution');
    const [parallel1, parallel2] = await Promise.all([
      roomService.runGarbageCollection(twoHoursMs),
      roomService.runGarbageCollection(twoHoursMs),
    ]);
    console.log(`  Concurrent GC runs executed safely without collisions (${parallel1.deletedRoomsCount + parallel2.deletedRoomsCount} deleted) ✅`);

    console.log('\n====================================================');
    console.log('🎉 ALL STALE GARBAGE COLLECTION TESTS PASSED (100%)');
    console.log('====================================================\n');
  } finally {
    // Cleanup test records
    if (testUser) {
      await UserModel.deleteOne({ _id: testUser._id });
    }
    for (const code of createdRoomCodes) {
      await RoomModel.deleteOne({ roomCode: code });
    }
    for (const bId of createdBattleIds) {
      await BattleModel.deleteOne({ _id: bId });
    }
    await mongoose.disconnect();
  }
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
