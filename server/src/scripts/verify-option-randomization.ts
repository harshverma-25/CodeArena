import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { BattleModel } from '../modules/battle/battle.model.js';
import { RoomModel } from '../modules/room/room.model.js';
import { QuestionModel } from '../modules/question/question.model.js';
import { UserModel } from '../modules/user/user.model.js';
import { battleService } from '../modules/battle/battle.service.js';
import { historyService } from '../modules/history/history.service.js';
import { roomRepository } from '../modules/room/room.repository.js';
import { RoomStatus } from '../modules/room/room.types.js';
import {
  getOptionPermutation,
  mapOriginalToDisplayed,
  mapDisplayedToOriginal,
} from '../modules/question/question-randomizer.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function verifyOptionRandomization() {
  console.log('=== End-to-End Verification: Safe Runtime Option Randomization ===\n');

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codearena';
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB.');

  const cleanupTasks: Array<() => Promise<any>> = [];

  try {
    // 1. Setup mock test question with known canonical answer
    // Note: Canonical answer is index 1 ("Option B"), which replicates the user's issue!
    const testQId = `rand-test-q-${Date.now()}`;
    const originalOptions = ['Canonical A', 'Canonical B', 'Canonical C', 'Canonical D'];
    const canonicalAnswer = 1; // "Canonical B"

    const questionDoc = await QuestionModel.create({
      questionId: testQId,
      question: 'Which option is canonical B?',
      options: originalOptions,
      correctAnswer: canonicalAnswer,
      explanation: 'Canonical B is correct.',
      difficulty: 'easy',
      topic: 'DSA',
      isPublished: true,
    });
    cleanupTasks.push(() => QuestionModel.deleteOne({ _id: questionDoc._id }));

    // Snapshot question document state before tests
    const snapshotBefore = await QuestionModel.findById(questionDoc._id).lean();

    // 2. Setup mock players
    const user1 = await UserModel.create({
      username: `rand_user1_${Date.now()}`,
      displayName: 'Random Player 1',
      authProvider: 'guest',
      stats: { totalMatches: 0, wins: 0, losses: 0, winStreak: 0, totalScore: 0 },
    });
    const user2 = await UserModel.create({
      username: `rand_user2_${Date.now()}`,
      displayName: 'Random Player 2',
      authProvider: 'guest',
      stats: { totalMatches: 0, wins: 0, losses: 0, winStreak: 0, totalScore: 0 },
    });
    cleanupTasks.push(() => UserModel.deleteMany({ _id: { $in: [user1._id, user2._id] } }));

    // 3. Setup mock room
    const roomCode = `TEST_RAND_${Date.now().toString().slice(-4)}`;
    const room = await RoomModel.create({
      roomCode,
      hostId: user1._id,
      players: [
        { userId: user1._id, isHost: true, isReady: true },
        { userId: user2._id, isHost: false, isReady: true },
      ],
      settings: {
        topic: 'DSA',
        difficulty: 'easy',
        questionCount: 10,
        timeLimit: 30,
      },
      status: RoomStatus.WAITING,
    });
    cleanupTasks.push(() => RoomModel.deleteOne({ _id: room._id }));

    // 4. Create Battle using the test question
    const battle = await BattleModel.create({
      roomId: room._id,
      roomCode,
      topic: 'DSA',
      difficulty: 'easy',
      questionCount: 10,
      timePerQuestion: 30,
      players: [
        {
          userId: user1._id,
          assignedQuestionIds: [testQId],
          currentQuestionIndex: 0,
          questionDeadline: new Date(Date.now() + 30000),
          answers: [],
          score: 0,
          status: 'IN_PROGRESS',
        },
        {
          userId: user2._id,
          assignedQuestionIds: [testQId],
          currentQuestionIndex: 0,
          questionDeadline: new Date(Date.now() + 30000),
          answers: [],
          score: 0,
          status: 'IN_PROGRESS',
        },
      ],
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      currentRound: {
        roundIndex: 0,
        questionId: testQId,
        startedAt: new Date(),
        deadline: new Date(Date.now() + 30000),
        status: 'QUESTION',
        revealExpiresAt: null,
        submissions: [],
      },
    });
    cleanupTasks.push(() => BattleModel.deleteOne({ _id: battle._id }));
    await roomRepository.update(roomCode, { status: RoomStatus.IN_PROGRESS, matchId: battle._id as any });

    console.log('\n--- Test 1: Multiplayer Question Delivery & Consistency ---');
    // Fetch init payload for Player 1 and Player 2
    const initP1 = await battleService.getBattleInitPayload(battle, user1._id.toString());
    const initP2 = await battleService.getBattleInitPayload(battle, user2._id.toString());

    if (!initP1 || !initP2) throw new Error('Failed to get init payloads');

    console.log('Delivered options to Player 1:', initP1.currentQuestion.options);
    console.log('Delivered options to Player 2:', initP2.currentQuestion.options);

    // Verify option texts match between players
    if (JSON.stringify(initP1.currentQuestion.options) !== JSON.stringify(initP2.currentQuestion.options)) {
      throw new Error('Multiplayer Desync: Players received different option orderings!');
    }
    console.log('✅ Both players received identical randomized option ordering.');

    // Verify anti-cheat: correctAnswer is NOT present in init payload
    if ((initP1.currentQuestion as any).correctAnswer !== undefined) {
      throw new Error('Leakage: correctAnswer exposed in init payload!');
    }
    console.log('✅ Anti-cheat verified: No correctAnswer leaked in delivery payload.');

    // Check reconnection consistency
    const reconnectPayload = await battleService.getBattleInitPayload(battle, user1._id.toString());
    if (JSON.stringify(reconnectPayload?.currentQuestion.options) !== JSON.stringify(initP1.currentQuestion.options)) {
      throw new Error('Reconnect Desync: Reconnecting player received different option ordering!');
    }
    console.log('✅ Reconnect consistency verified: Option ordering is stable upon reconnection.');

    console.log('\n--- Test 2: Answer Submission Translation ---');
    const perm = getOptionPermutation(battle._id.toString(), testQId, 0);
    // Find which card index on the UI displays "Canonical B"
    const displayedCorrectCard = initP1.currentQuestion.options.indexOf('Canonical B');
    console.log(`Permutation: ${JSON.stringify(perm)}`);
    console.log(`On screen, "Canonical B" is displayed at card index: ${displayedCorrectCard}`);

    // Pick a card that is NOT "Canonical B" for Player 2
    const displayedWrongCard = (displayedCorrectCard + 1) % 4;
    console.log(`Player 1 will click card ${displayedCorrectCard} ("${initP1.currentQuestion.options[displayedCorrectCard]}")`);
    console.log(`Player 2 will click card ${displayedWrongCard} ("${initP2.currentQuestion.options[displayedWrongCard]}")`);

    // Player 1 submits the displayed correct card
    const sub1 = await battleService.submitAnswer(
      user1._id.toString(),
      roomCode,
      testQId,
      displayedCorrectCard
    );
    if (!sub1.isCorrect) {
      throw new Error('Failed: Player 1 selected correct card but was marked incorrect!');
    }
    console.log('✅ Player 1 submission correctly validated as TRUE.');

    // Player 2 submits a displayed wrong card
    const sub2 = await battleService.submitAnswer(
      user2._id.toString(),
      roomCode,
      testQId,
      displayedWrongCard
    );
    if (sub2.isCorrect) {
      throw new Error('Failed: Player 2 selected wrong card but was marked correct!');
    }
    console.log('✅ Player 2 submission correctly validated as FALSE.');

    console.log('\n--- Test 3: Synchronized Round Reveal ---');
    // Execute reveal
    await battleService.executeRoundReveal(battle._id.toString(), roomCode);

    const revealState = await battleService.getBattleRevealPayloadIfRevealed(battle._id.toString());
    if (!revealState) throw new Error('Failed to get reveal state');

    console.log(`Reveal payload correctAnswer index: ${revealState.correctAnswer}`);
    if (revealState.correctAnswer !== displayedCorrectCard) {
      throw new Error(
        `Reveal Desync: Expected reveal correctAnswer to be displayed card ${displayedCorrectCard}, got ${revealState.correctAnswer}`
      );
    }
    console.log('✅ Reveal payload matches displayed card index on client UI.');

    console.log('\n--- Test 4: Finalization and History Review Consistency ---');
    const freshBattle = await BattleModel.findById(battle._id);
    if (!freshBattle) throw new Error('Battle missing');
    await battleService.finalizeBattle(freshBattle);

    const historyDetails = await historyService.getBattleResults(battle._id.toString(), user1._id.toString());
    const p1History = historyDetails.players.find((p) => p.userId === user1._id.toString());
    const qBreakdown = p1History?.questions[0];

    if (!qBreakdown) throw new Error('Question breakdown missing in history');

    console.log('History review question:');
    console.log(`  Options: ${JSON.stringify(qBreakdown.options)}`);
    console.log(`  correctAnswer index: ${qBreakdown.correctAnswer} (${qBreakdown.options[qBreakdown.correctAnswer]})`);
    console.log(`  selectedOption index: ${qBreakdown.selectedOption} (${qBreakdown.options[qBreakdown.selectedOption]})`);
    console.log(`  isCorrect: ${qBreakdown.isCorrect}`);

    if (qBreakdown.selectedOption !== canonicalAnswer) {
      throw new Error(
        `History mapping mismatch: Expected selectedOption in history to map to original answer ${canonicalAnswer}, got ${qBreakdown.selectedOption}`
      );
    }
    if (!qBreakdown.isCorrect) {
      throw new Error('History indicates incorrect when answer was correct');
    }
    console.log('✅ Post-game history accurately maps back to canonical question representation.');

    console.log('\n--- Test 5: MongoDB Question Document Integrity Check ---');
    const snapshotAfter = await QuestionModel.findById(questionDoc._id).lean();

    if (JSON.stringify(snapshotBefore) !== JSON.stringify(snapshotAfter)) {
      throw new Error('CRITICAL VIOLATION: MongoDB question document was modified!');
    }
    console.log('✅ MongoDB question document remains 100% UNCHANGED (zero mutations/writes).');

    console.log('\n======================================================');
    console.log('🎉 All Runtime Option Randomization Verifications Passed!');
    console.log('======================================================\n');
  } finally {
    for (const cleanup of cleanupTasks) {
      try {
        await cleanup();
      } catch (e) {
        // ignore cleanup error
      }
    }
    await mongoose.disconnect();
  }
}

verifyOptionRandomization().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
