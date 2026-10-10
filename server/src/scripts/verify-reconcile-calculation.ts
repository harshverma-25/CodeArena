/**
 * Automated Verification Suite for User Statistics Reconciliation Logic (HD-012)
 * Validates calculation derivation, edge cases (draws, incomplete, solo, accuracy), and idempotency.
 */

export interface SimulatedPlayer {
  userId: string | { _id: string; username?: string };
  assignedQuestionIds?: string[];
  answers?: Array<{
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
  }>;
}

export interface SimulatedBattle {
  _id: string;
  status: string;
  winnerId: string | { _id: string } | null;
  isDraw?: boolean;
  questionCount?: number;
  players: SimulatedPlayer[];
}

export interface CalculatedStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
}

/**
 * Pure calculation function extracted from reconcile-user-stats.ts
 */
export function calculateUserStats(userId: string, battles: SimulatedBattle[]): CalculatedStats {
  // Filter for completed battles involving this user
  const userBattles = battles.filter(
    (b) =>
      b.status === 'COMPLETED' &&
      b.players?.some((p) => {
        const pId = typeof p.userId === 'object' && p.userId?._id ? p.userId._id : String(p.userId);
        return pId === userId;
      })
  );

  let wins = 0;
  let losses = 0;
  let draws = 0;
  let totalCorrect = 0;
  let totalQuestions = 0;

  for (const b of userBattles) {
    const pObj = b.players?.find((p) => {
      const pId = typeof p.userId === 'object' && p.userId?._id ? p.userId._id : String(p.userId);
      return pId === userId;
    });

    if (pObj) {
      const qCount = b.questionCount || pObj.assignedQuestionIds?.length || 0;
      const correct = pObj.answers ? pObj.answers.filter((a) => a.isCorrect).length : 0;
      totalQuestions += qCount;
      totalCorrect += correct;
    }

    const winnerIdStr = b.winnerId
      ? typeof b.winnerId === 'object' && b.winnerId?._id
        ? b.winnerId._id
        : String(b.winnerId)
      : null;

    if (b.isDraw) {
      draws++;
    } else if (winnerIdStr === userId) {
      wins++;
    } else if (winnerIdStr !== null) {
      losses++;
    }
  }

  const matchesPlayed = userBattles.length;
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return {
    matchesPlayed,
    wins,
    losses,
    draws,
    totalCorrect,
    totalQuestions,
    accuracy,
  };
}

async function runReconciliationCalculationTests() {
  console.log('====================================================');
  console.log('🧪 HD-012: Reconciliation Calculation Unit Test Suite');
  console.log('====================================================\n');

  const USER_A = 'user_aaa111';
  const USER_B = 'user_bbb222';
  const USER_C = 'user_ccc333';
  const USER_D = 'user_ddd444';

  // --- Scenario 1: Standard 1v1 Win and Loss ---
  console.log('▶️ Test 1: Standard 1v1 Win & Loss calculation...');
  const battle1: SimulatedBattle = {
    _id: 'b1',
    status: 'COMPLETED',
    winnerId: USER_A,
    isDraw: false,
    questionCount: 10,
    players: [
      { userId: USER_A, answers: [{ questionId: 'q1', selectedOption: 0, isCorrect: true }] },
      { userId: USER_B, answers: [{ questionId: 'q1', selectedOption: 1, isCorrect: false }] },
    ],
  };

  const statsA1 = calculateUserStats(USER_A, [battle1]);
  const statsB1 = calculateUserStats(USER_B, [battle1]);

  if (statsA1.wins !== 1 || statsA1.losses !== 0 || statsA1.matchesPlayed !== 1) {
    throw new Error(`Test 1 Failed for User A: Expected 1 win, got ${JSON.stringify(statsA1)}`);
  }
  if (statsB1.wins !== 0 || statsB1.losses !== 1 || statsB1.matchesPlayed !== 1) {
    throw new Error(`Test 1 Failed for User B: Expected 1 loss, got ${JSON.stringify(statsB1)}`);
  }
  console.log('  Standard 1v1 win/loss derived accurately ✅');

  // --- Scenario 2: Draw Match Handling ---
  console.log('\n▶️ Test 2: Draw Match Handling (isDraw: true)...');
  const battle2: SimulatedBattle = {
    _id: 'b2',
    status: 'COMPLETED',
    winnerId: null,
    isDraw: true,
    questionCount: 10,
    players: [
      { userId: USER_A, answers: [] },
      { userId: USER_B, answers: [] },
    ],
  };

  const statsA2 = calculateUserStats(USER_A, [battle2]);
  const statsB2 = calculateUserStats(USER_B, [battle2]);

  if (statsA2.draws !== 1 || statsA2.wins !== 0 || statsA2.losses !== 0) {
    throw new Error(`Test 2 Failed for User A: Expected 1 draw, got ${JSON.stringify(statsA2)}`);
  }
  if (statsB2.draws !== 1 || statsB2.wins !== 0 || statsB2.losses !== 0) {
    throw new Error(`Test 2 Failed for User B: Expected 1 draw, got ${JSON.stringify(statsB2)}`);
  }
  console.log('  Draws correctly isolated from wins and losses ✅');

  // --- Scenario 3: 4-Player Battle (1 Winner, 3 Losers) ---
  console.log('\n▶️ Test 3: 4-Player Multiplayer Battle...');
  const battle3: SimulatedBattle = {
    _id: 'b3',
    status: 'COMPLETED',
    winnerId: USER_C,
    isDraw: false,
    questionCount: 15,
    players: [
      { userId: USER_A, answers: [] },
      { userId: USER_B, answers: [] },
      { userId: USER_C, answers: [] },
      { userId: USER_D, answers: [] },
    ],
  };

  const statsC3 = calculateUserStats(USER_C, [battle3]);
  const statsD3 = calculateUserStats(USER_D, [battle3]);

  if (statsC3.wins !== 1 || statsC3.losses !== 0) {
    throw new Error(`Test 3 Failed for User C: Expected 1 win, got ${JSON.stringify(statsC3)}`);
  }
  if (statsD3.losses !== 1 || statsD3.wins !== 0) {
    throw new Error(`Test 3 Failed for User D: Expected 1 loss, got ${JSON.stringify(statsD3)}`);
  }
  console.log('  4-player battle assigns 1 win to champion and losses to other contenders ✅');

  // --- Scenario 4: Incomplete & Abandoned Battles Excluded ---
  console.log('\n▶️ Test 4: Incomplete / Abandoned Battles (status !== COMPLETED)...');
  const battleInProgress: SimulatedBattle = {
    _id: 'b_ip',
    status: 'IN_PROGRESS',
    winnerId: null,
    questionCount: 10,
    players: [{ userId: USER_A }],
  };
  const battleCancelled: SimulatedBattle = {
    _id: 'b_canc',
    status: 'CANCELLED',
    winnerId: null,
    questionCount: 10,
    players: [{ userId: USER_A }],
  };
  const battleWaiting: SimulatedBattle = {
    _id: 'b_wait',
    status: 'WAITING',
    winnerId: null,
    questionCount: 10,
    players: [{ userId: USER_A }],
  };

  const statsAIncomplete = calculateUserStats(USER_A, [battleInProgress, battleCancelled, battleWaiting]);
  if (statsAIncomplete.matchesPlayed !== 0 || statsAIncomplete.wins !== 0) {
    throw new Error(`Test 4 Failed: Incomplete battles must not increment stats: ${JSON.stringify(statsAIncomplete)}`);
  }
  console.log('  Non-completed battles are strictly excluded from calculations ✅');

  // --- Scenario 5: Accuracy & Answer Calculation ---
  console.log('\n▶️ Test 5: Accuracy Percentage Clamping & Derivation...');
  const battleAccuracy: SimulatedBattle = {
    _id: 'b_acc',
    status: 'COMPLETED',
    winnerId: USER_A,
    questionCount: 20,
    players: [
      {
        userId: USER_A,
        answers: [
          { questionId: 'q1', selectedOption: 0, isCorrect: true },
          { questionId: 'q2', selectedOption: 1, isCorrect: true },
          { questionId: 'q3', selectedOption: 2, isCorrect: true },
          { questionId: 'q4', selectedOption: 3, isCorrect: false },
        ],
      },
    ],
  };

  const statsAccuracy = calculateUserStats(USER_A, [battleAccuracy]);
  // 3 correct out of 20 questions = 15%
  if (statsAccuracy.totalCorrect !== 3 || statsAccuracy.totalQuestions !== 20 || statsAccuracy.accuracy !== 15) {
    throw new Error(`Test 5 Failed: Accuracy calculation mismatch: ${JSON.stringify(statsAccuracy)}`);
  }
  console.log('  Accuracy correctly computed as Math.round((3/20)*100) = 15% ✅');

  // --- Scenario 6: Idempotence Test ---
  console.log('\n▶️ Test 6: Deterministic Idempotence Check...');
  const allBattles = [battle1, battle2, battle3, battleInProgress, battleAccuracy];
  const run1 = calculateUserStats(USER_A, allBattles);
  const run2 = calculateUserStats(USER_A, allBattles);
  const run3 = calculateUserStats(USER_A, allBattles);

  if (JSON.stringify(run1) !== JSON.stringify(run2) || JSON.stringify(run2) !== JSON.stringify(run3)) {
    throw new Error('Test 6 Failed: Non-deterministic calculation detected between consecutive runs!');
  }
  console.log('  Calculations are strictly idempotent and deterministic across repeated runs ✅');

  console.log('\n====================================================');
  console.log('🎉 ALL RECONCILIATION CALCULATION TESTS PASSED!');
  console.log('====================================================\n');
}

runReconciliationCalculationTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
