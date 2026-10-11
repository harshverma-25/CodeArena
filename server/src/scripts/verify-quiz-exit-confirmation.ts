import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { battleService } from '../modules/battle/battle.service.js';
import { roomService } from '../modules/room/room.service.js';
import { UserModel } from '../modules/user/user.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function runExitConfirmationVerification() {
  console.log('====================================================');
  console.log('🧪 Active Quiz Exit Confirmation & Forfeit Verification');
  console.log('====================================================\n');

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codearena';
  await mongoose.connect(uri);

  try {
    // 1. Create or find test users
    const userA = await UserModel.findOneAndUpdate(
      { username: 'exit_test_user_a' },
      { username: 'exit_test_user_a', email: 'exit_a@test.com', passwordHash: 'hash', role: 'user' },
      { upsert: true, new: true }
    );
    const userB = await UserModel.findOneAndUpdate(
      { username: 'exit_test_user_b' },
      { username: 'exit_test_user_b', email: 'exit_b@test.com', passwordHash: 'hash', role: 'user' },
      { upsert: true, new: true }
    );

    const userIdA = userA._id.toString();
    const userIdB = userB._id.toString();

    // -------------------------------------------------------------
    // Test 1: Solo Quiz Forfeit Lifecycle
    // -------------------------------------------------------------
    console.log('▶️ Test 1: Solo Quiz Forfeit Lifecycle');
    const soloRoom = await roomService.createRoom(userIdA, {
      topic: 'DSA',
      difficulty: 'easy',
      questionCount: 10,
    });
    console.log(`  Solo room created: ${soloRoom.roomCode}`);

    const soloBattle = await battleService.startBattle(userIdA, soloRoom.roomCode);
    console.log(`  Solo battle started: ${soloBattle._id.toString()}`);

    // Verify battle is active
    let activeBattle = await battleService.getActiveBattleByRoomCode(soloRoom.roomCode);
    if (!activeBattle || activeBattle.status !== 'IN_PROGRESS') {
      throw new Error(`Solo battle was not active upon start, got ${activeBattle?.status}`);
    }
    console.log('  Active battle verified: IN_PROGRESS ✅');

    // Perform forfeit
    const forfeitResult = await battleService.forfeitBattle(userIdA, soloRoom.roomCode);
    if (!forfeitResult.success || !forfeitResult.finalized) {
      throw new Error(`Forfeit failed or was not finalized: ${JSON.stringify(forfeitResult)}`);
    }
    console.log('  Solo forfeit executed & finalized successfully ✅');

    // Verify battle in DB is now COMPLETED
    const completedBattle = await BattleModel.findById(soloBattle._id);
    if (!completedBattle || completedBattle.status !== 'COMPLETED') {
      throw new Error(`Expected battle status COMPLETED, got ${completedBattle?.status}`);
    }
    console.log('  Battle status transitioned to COMPLETED ✅');

    // Verify room is now FINISHED
    const finishedRoom = await roomService.getRoom(soloRoom.roomCode);
    if (!finishedRoom || finishedRoom.status !== 'FINISHED') {
      throw new Error(`Expected room status FINISHED, got ${finishedRoom?.status}`);
    }
    console.log('  Room status transitioned to FINISHED ✅');

    // Test Idempotency: Forfeit again should not throw
    const idempotentResult = await battleService.forfeitBattle(userIdA, soloRoom.roomCode);
    if (!idempotentResult.success) {
      throw new Error('Repeated forfeit call was not handled idempotently');
    }
    console.log('  Idempotent forfeit verified: safely returned success on repeat call ✅\n');

    // -------------------------------------------------------------
    // Test 2: Multiplayer Quiz Forfeit Lifecycle (Exiting player leaves, match continues)
    // -------------------------------------------------------------
    console.log('▶️ Test 2: Multiplayer Quiz Forfeit Lifecycle');
    const mpRoom = await roomService.createRoom(userIdA, {
      topic: 'DSA',
      difficulty: 'easy',
      questionCount: 10,
    });
    await roomService.joinRoom(userIdB, mpRoom.roomCode);
    await roomService.updateReadyStatus(userIdB, mpRoom.roomCode, true);
    console.log(`  2-player room created & joined: ${mpRoom.roomCode}`);

    const mpBattle = await battleService.startBattle(userIdA, mpRoom.roomCode);
    console.log(`  Multiplayer battle started: ${mpBattle._id.toString()}`);

    // Player A (Host) forfeits
    const mpForfeitA = await battleService.forfeitBattle(userIdA, mpRoom.roomCode);
    if (!mpForfeitA.success || mpForfeitA.finalized !== false) {
      throw new Error(`Player A forfeit should succeed without finalizing match for Player B: ${JSON.stringify(mpForfeitA)}`);
    }
    console.log('  Player A forfeit completed. Match remains active for Player B ✅');

    // Verify Player A is COMPLETED but battle is still IN_PROGRESS
    let mpBattleCheck = await BattleModel.findById(mpBattle._id);
    const playerAStatus = mpBattleCheck?.players.find((p) => p.userId.toString() === userIdA)?.status;
    const playerBStatus = mpBattleCheck?.players.find((p) => p.userId.toString() === userIdB)?.status;

    if (playerAStatus !== 'COMPLETED') {
      throw new Error(`Expected Player A status COMPLETED, got ${playerAStatus}`);
    }
    if (playerBStatus !== 'IN_PROGRESS') {
      throw new Error(`Expected Player B status IN_PROGRESS, got ${playerBStatus}`);
    }
    if (mpBattleCheck?.status !== 'IN_PROGRESS') {
      throw new Error(`Expected battle status IN_PROGRESS, got ${mpBattleCheck?.status}`);
    }
    console.log('  Player A marked COMPLETED, Player B remains IN_PROGRESS, battle is IN_PROGRESS ✅');

    // Player B also forfeits -> match should now finalize
    const mpForfeitB = await battleService.forfeitBattle(userIdB, mpRoom.roomCode);
    if (!mpForfeitB.success || mpForfeitB.finalized !== true) {
      throw new Error(`Player B forfeit should finalize battle as all players departed: ${JSON.stringify(mpForfeitB)}`);
    }
    console.log('  Player B forfeit completed. Battle successfully finalized as all players departed ✅');

    const finalizedMpBattle = await BattleModel.findById(mpBattle._id);
    if (finalizedMpBattle?.status !== 'COMPLETED') {
      throw new Error(`Expected multiplayer battle status COMPLETED, got ${finalizedMpBattle?.status}`);
    }
    console.log('  Multiplayer battle status transitioned to COMPLETED ✅\n');

    // -------------------------------------------------------------
    // Test 3: Unauthorized Forfeit Rejection
    // -------------------------------------------------------------
    console.log('▶️ Test 3: Unauthorized Forfeit Rejection');
    const userC = await UserModel.findOneAndUpdate(
      { username: 'exit_test_user_c' },
      { username: 'exit_test_user_c', email: 'exit_c@test.com', passwordHash: 'hash', role: 'user' },
      { upsert: true, new: true }
    );
    const userIdC = userC._id.toString();

    const test3Room = await roomService.createRoom(userIdA, {
      topic: 'DSA',
      difficulty: 'easy',
      questionCount: 10,
    });
    await battleService.startBattle(userIdA, test3Room.roomCode);

    try {
      await battleService.forfeitBattle(userIdC, test3Room.roomCode);
      throw new Error('Non-participant was able to forfeit battle');
    } catch (err: any) {
      if (err.statusCode === 403 || err.message?.includes('not part of this battle')) {
        console.log('  Non-participant forfeit correctly rejected with 403 Forbidden ✅');
      } else {
        throw err;
      }
    }

    // Clean up test3Room
    await battleService.forfeitBattle(userIdA, test3Room.roomCode);

    console.log('\n====================================================');
    console.log('🎉 ALL ACTIVE QUIZ EXIT & FORFEIT TESTS PASSED!');
    console.log('====================================================');
  } finally {
    await mongoose.disconnect();
  }
}

runExitConfirmationVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
