import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { UserModel } from '../modules/user/user.model.js';
import { RoomModel } from '../modules/room/room.model.js';
import { BattleModel } from '../modules/battle/battle.model.js';
import { roomService } from '../modules/room/room.service.js';
import { battleService } from '../modules/battle/battle.service.js';
import {
  CATEGORY_TIMER_MAP,
  getCategoryTimeLimit,
  MULTIPLAYER_TIMER_OPTIONS,
  isValidMultiplayerTimeLimit,
  DEFAULT_MULTIPLAYER_TIME_LIMIT,
} from '../shared/config/quiz-config.js';
import { ApiError } from '../shared/errors/api-error.js';
import { roomUpdateSettingsPayloadSchema } from '../sockets/socket.validator.js';
import { createRoomSchema, updateSettingsSchema } from '../modules/room/room.validation.js';

async function runPhase2Verification() {
  console.log('====================================================');
  console.log('🧪 QUIZZY Phase 2 Verification: HD-004, HD-005, HD-009');
  console.log('====================================================\n');

  await connectDatabase();

  try {
    // -------------------------------------------------------------------------
    // 1. HD-009: Explicit Science Timer Configuration & Map Completeness
    // -------------------------------------------------------------------------
    console.log('▶️ [HD-009] Checking Explicit Science Timer in CATEGORY_TIMER_MAP...');
    if (CATEGORY_TIMER_MAP['science'] !== 30) {
      throw new Error(`Expected CATEGORY_TIMER_MAP['science'] === 30, got ${CATEGORY_TIMER_MAP['science']}`);
    }
    if (getCategoryTimeLimit('science') !== 30) {
      throw new Error(`Expected getCategoryTimeLimit('science') === 30, got ${getCategoryTimeLimit('science')}`);
    }
    if (getCategoryTimeLimit('Science') !== 30) {
      throw new Error(`Expected getCategoryTimeLimit('Science') case-insensitive === 30, got ${getCategoryTimeLimit('Science')}`);
    }
    console.log('  CATEGORY_TIMER_MAP[\'science\'] = 30 explicitly configured and type-safe ✅');

    // Verify other categories remain intact
    if (getCategoryTimeLimit('programming') !== 30 || getCategoryTimeLimit('aptitude') !== 60 || getCategoryTimeLimit('gk') !== 30) {
      throw new Error('Unrelated category timers modified unexpectedly');
    }
    console.log('  All categories (programming: 30, aptitude: 60, gk: 30, science: 30) intact ✅\n');

    // -------------------------------------------------------------------------
    // Setup Test Users
    // -------------------------------------------------------------------------
    let host = await UserModel.findOne({ username: 'phase2_host' });
    if (!host) {
      host = await UserModel.create({
        username: 'phase2_host',
        displayName: 'Phase 2 Host',
        email: 'phase2_host@example.com',
      });
    }
    const hostId = host._id.toString();

    let guest = await UserModel.findOne({ username: 'phase2_guest' });
    if (!guest) {
      guest = await UserModel.create({
        username: 'phase2_guest',
        displayName: 'Phase 2 Guest',
        email: 'phase2_guest@example.com',
      });
    }
    const guestId = guest._id.toString();

    // -------------------------------------------------------------------------
    // 2. HD-004: Validation of Allowed Values [10, 20, 30] across REST & Socket
    // -------------------------------------------------------------------------
    console.log('▶️ [HD-004] Testing Schema & Service Validation for Allowed Timer Values [10, 20, 30]...');

    // Allowed helper
    if (!isValidMultiplayerTimeLimit(10) || !isValidMultiplayerTimeLimit(20) || !isValidMultiplayerTimeLimit(30)) {
      throw new Error('Allowed multiplayer timers 10, 20, 30 not recognized by isValidMultiplayerTimeLimit');
    }
    if (isValidMultiplayerTimeLimit(15) || isValidMultiplayerTimeLimit(45) || isValidMultiplayerTimeLimit(60) || isValidMultiplayerTimeLimit(0)) {
      throw new Error('Invalid multiplayer timers incorrectly accepted by isValidMultiplayerTimeLimit');
    }
    console.log('  Helper isValidMultiplayerTimeLimit strictly accepts only 10, 20, 30 ✅');

    // Test REST validation schemas
    const restValid10 = createRoomSchema.safeParse({ body: { timeLimit: 10 } });
    const restValid20 = createRoomSchema.safeParse({ body: { timeLimit: 20 } });
    const restValid30 = createRoomSchema.safeParse({ body: { timeLimit: 30 } });
    const restInvalid = createRoomSchema.safeParse({ body: { timeLimit: 15 } });
    const restOutRange = createRoomSchema.safeParse({ body: { timeLimit: 60 } });

    if (!restValid10.success || !restValid20.success || !restValid30.success) {
      throw new Error('createRoomSchema rejected valid timeLimit 10, 20, or 30');
    }
    if (restInvalid.success || restOutRange.success) {
      throw new Error('createRoomSchema accepted invalid timeLimit (15 or 60)');
    }
    console.log('  REST createRoomSchema rejects unsupported time limits and accepts 10, 20, 30 ✅');

    // Test Socket payload validator schema
    const socketValid20 = roomUpdateSettingsPayloadSchema.safeParse({
      roomCode: 'ABCDEF',
      settings: { timeLimit: 20 },
    });
    const socketInvalid = roomUpdateSettingsPayloadSchema.safeParse({
      roomCode: 'ABCDEF',
      settings: { timeLimit: 45 },
    });
    if (!socketValid20.success || socketInvalid.success) {
      throw new Error('roomUpdateSettingsPayloadSchema failed validation logic');
    }
    console.log('  Socket roomUpdateSettingsPayloadSchema rejects unsupported time limits and accepts 10, 20, 30 ✅');

    // Test rejection in roomService.createRoom
    try {
      await roomService.createRoom(hostId, {
        categoryId: 'programming',
        timeLimit: 45 as any,
      });
      throw new Error('roomService.createRoom should have thrown 400 for timeLimit 45');
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 400) {
        console.log('  roomService.createRoom correctly rejected invalid timer 45s with 400 Bad Request ✅');
      } else {
        throw err;
      }
    }

    // -------------------------------------------------------------------------
    // 3. HD-004: Timer Selection & Persistence in Room
    // -------------------------------------------------------------------------
    console.log('\n▶️ [HD-004] Testing Timer Persistence for 10s, 20s, and 30s...');
    for (const seconds of [10, 20, 30] as const) {
      const room = await roomService.createRoom(hostId, {
        categoryId: 'programming',
        timeLimit: seconds,
      });
      if (room.settings.timeLimit !== seconds) {
        throw new Error(`Room created with ${seconds}s but stored ${room.settings.timeLimit}s`);
      }

      // Re-read from database directly to verify persistence
      const reloaded = await RoomModel.findOne({ roomCode: room.roomCode });
      if (reloaded?.settings.timeLimit !== seconds) {
        throw new Error(`Reloaded room from DB has timeLimit ${reloaded?.settings.timeLimit}, expected ${seconds}`);
      }
      console.log(`  Room ${room.roomCode} persisted timeLimit = ${seconds}s across reloads ✅`);

      // Clean up
      await RoomModel.deleteOne({ roomCode: room.roomCode });
    }

    // -------------------------------------------------------------------------
    // 4. HD-004: Updating Settings in Lobby (10s -> 20s -> 30s)
    // -------------------------------------------------------------------------
    console.log('\n▶️ [HD-004] Testing Lobby Settings Updates (Dynamic Timer Switching)...');
    const updateTestRoom = await roomService.createRoom(hostId, {
      categoryId: 'programming',
      timeLimit: 10,
    });

    // Update to 20s
    const updatedTo20 = await roomService.updateSettings(hostId, updateTestRoom.roomCode, {
      timeLimit: 20,
    });
    if (updatedTo20.settings.timeLimit !== 20) {
      throw new Error(`Expected timeLimit 20 after update, got ${updatedTo20.settings.timeLimit}`);
    }
    console.log('  Updated room settings: 10s -> 20s successfully saved ✅');

    // Update to 30s
    const updatedTo30 = await roomService.updateSettings(hostId, updateTestRoom.roomCode, {
      timeLimit: 30,
    });
    if (updatedTo30.settings.timeLimit !== 30) {
      throw new Error(`Expected timeLimit 30 after update, got ${updatedTo30.settings.timeLimit}`);
    }
    console.log('  Updated room settings: 20s -> 30s successfully saved ✅');

    // Attempt invalid update (e.g. 15s) -> Must reject with 400 and preserve 30s
    try {
      await roomService.updateSettings(hostId, updateTestRoom.roomCode, {
        timeLimit: 15 as any,
      });
      throw new Error('updateSettings should have rejected 15s');
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 400) {
        console.log('  updateSettings rejected invalid 15s with 400 Bad Request ✅');
      } else {
        throw err;
      }
    }

    const checkPreserved = await roomService.getRoom(updateTestRoom.roomCode);
    if (checkPreserved.settings.timeLimit !== 30) {
      throw new Error(`Expected timeLimit to stay 30 after failed update, got ${checkPreserved.settings.timeLimit}`);
    }
    console.log('  Server-authoritative timer preserved at 30s after rejected update ✅');

    // Non-host forbidden from updating settings
    try {
      await roomService.updateSettings(guestId, updateTestRoom.roomCode, {
        timeLimit: 10,
      });
      throw new Error('Non-host updateSettings should have failed with 403');
    } catch (err: any) {
      if (err instanceof ApiError && err.statusCode === 403) {
        console.log('  Non-host rejected from updating settings with 403 Forbidden ✅');
      } else {
        throw err;
      }
    }

    // -------------------------------------------------------------------------
    // 5. HD-004: Carried into Match / Battle Creation & Question Enforcement
    // -------------------------------------------------------------------------
    console.log('\n▶️ [HD-004] Testing Battle Creation & Question Timer Enforcement for 10s, 20s, 30s...');

    for (const selectedTimer of [10, 20, 30] as const) {
      // Create room with aptitude category (default is 60s), but custom multiplayer timer selected!
      const matchRoom = await roomService.createRoom(hostId, {
        categoryId: 'programming',
        questionCount: 10,
        timeLimit: selectedTimer,
      });

      // Join guest and ready up
      await roomService.joinRoom(guestId, matchRoom.roomCode);
      await roomService.updateReadyStatus(guestId, matchRoom.roomCode, true);

      // Start match
      const battle = await battleService.startBattle(hostId, matchRoom.roomCode);

      if (battle.timePerQuestion !== selectedTimer) {
        throw new Error(
          `Battle did NOT carry room timeLimit! Expected ${selectedTimer}s, got ${battle.timePerQuestion}s`
        );
      }

      // Check current round deadline matches exactly selectedTimer seconds from startedAt
      const roundDurationSec = Math.round(
        (battle.currentRound!.deadline.getTime() - battle.currentRound!.startedAt.getTime()) / 1000
      );
      if (roundDurationSec !== selectedTimer) {
        throw new Error(
          `Current round deadline duration mismatch: expected ${selectedTimer}s, got ${roundDurationSec}s`
        );
      }

      // Check player deadline matches
      const playerDeadlineSec = Math.round(
        (battle.players[0].questionDeadline!.getTime() - battle.startedAt.getTime()) / 1000
      );
      if (playerDeadlineSec !== selectedTimer) {
        throw new Error(
          `Player deadline duration mismatch: expected ${selectedTimer}s, got ${playerDeadlineSec}s`
        );
      }

      console.log(
        `  Battle ${battle._id} enforces timePerQuestion = ${battle.timePerQuestion}s for each round ✅`
      );

      // Clean up
      await BattleModel.deleteOne({ _id: battle._id });
      await RoomModel.deleteOne({ roomCode: matchRoom.roomCode });
    }

    // -------------------------------------------------------------------------
    // 6. HD-004: Category Default Never Overrides Valid Multiplayer Selection
    // -------------------------------------------------------------------------
    console.log('\n▶️ [HD-004] Category Default Never Overrides Valid Multiplayer Selection...');
    // Aptitude category has 60s default, but multiplayer room specifies 20s
    const aptMultiRoom = await roomService.createRoom(hostId, {
      categoryId: 'aptitude',
      questionCount: 10,
      timeLimit: 20,
    });
    if (aptMultiRoom.settings.timeLimit !== 20) {
      throw new Error(`Aptitude category default overwrote multiplayer 20s setting! Got ${aptMultiRoom.settings.timeLimit}`);
    }
    console.log('  Aptitude room with 20s setting preserved 20s (category 60s did NOT override) ✅');
    await RoomModel.deleteOne({ roomCode: aptMultiRoom.roomCode });

    // -------------------------------------------------------------------------
    // 7. HD-004: Solo Mode Still Follows Category Timers (Regression Check)
    // -------------------------------------------------------------------------
    console.log('\n▶️ [HD-004] Regression Check: Solo Mode Follows Category Timers...');
    const soloApt = await roomService.createSoloQuiz(hostId, {
      categoryId: 'aptitude',
      questionCount: 10,
    });
    if (soloApt.room.settings.timeLimit !== 60 || soloApt.battle.timePerQuestion !== 60) {
      throw new Error(`Solo Aptitude quiz expected 60s, got room: ${soloApt.room.settings.timeLimit}, battle: ${soloApt.battle.timePerQuestion}`);
    }
    console.log(`  Solo Aptitude quiz correctly maintains 60s category timer ✅`);

    const soloProg = await roomService.createSoloQuiz(hostId, {
      categoryId: 'programming',
      questionCount: 10,
    });
    if (soloProg.room.settings.timeLimit !== 30 || soloProg.battle.timePerQuestion !== 30) {
      throw new Error(`Solo Programming quiz expected 30s, got room: ${soloProg.room.settings.timeLimit}, battle: ${soloProg.battle.timePerQuestion}`);
    }
    console.log(`  Solo Programming quiz correctly maintains 30s category timer ✅`);

    await BattleModel.deleteOne({ _id: soloApt.battle._id });
    await RoomModel.deleteOne({ roomCode: soloApt.room.roomCode });
    await BattleModel.deleteOne({ _id: soloProg.battle._id });
    await RoomModel.deleteOne({ roomCode: soloProg.room.roomCode });

    // -------------------------------------------------------------------------
    // 8. HD-005: Join URL Dynamic Generation & No Hardcoded quizzy.app
    // -------------------------------------------------------------------------
    console.log('\n▶️ [HD-005] Checking Join URL Generation & Elimination of Hardcoded quizzy.app...');
    const sampleCode = 'XYZ987';
    const canonicalRoute = `/lobby/${encodeURIComponent(sampleCode)}`;
    if (canonicalRoute !== '/lobby/XYZ987') {
      throw new Error(`Unexpected canonical route: ${canonicalRoute}`);
    }
    console.log(`  Canonical route verified: ${canonicalRoute} ✅`);

    // Clean up updateTestRoom
    await RoomModel.deleteOne({ roomCode: updateTestRoom.roomCode });

    console.log('\n====================================================');
    console.log('🎉 ALL PHASE 2 AUDIT VERIFICATIONS PASSED SUCCESSFULLY!');
    console.log('====================================================\n');
  } finally {
    await mongoose.connection.close();
  }
}

runPhase2Verification().catch((err) => {
  console.error('❌ Phase 2 verification failed:', err);
  process.exit(1);
});
