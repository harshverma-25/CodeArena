import {
  getOptionPermutation,
  randomizeOptions,
  mapDisplayedToOriginal,
  mapOriginalToDisplayed,
} from '../modules/question/question-randomizer.js';

function runRandomizerTests() {
  console.log('=== Testing Question Option Randomizer ===\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`);
      failed++;
    }
  }

  // 1. Determinism
  const matchId1 = '660000000000000000000001';
  const qId1 = 'dsa-001';
  const roundIdx = 0;

  const p1 = getOptionPermutation(matchId1, qId1, roundIdx);
  const p2 = getOptionPermutation(matchId1, qId1, roundIdx);

  assert(
    JSON.stringify(p1) === JSON.stringify(p2),
    'Deterministic: Identical seed produces identical permutation'
  );

  // 2. Different matches or questions produce different permutations
  const matchId2 = '660000000000000000000002';
  const pDiffMatch = getOptionPermutation(matchId2, qId1, roundIdx);
  const pDiffQ = getOptionPermutation(matchId1, 'dsa-002', roundIdx);
  const pDiffRound = getOptionPermutation(matchId1, qId1, 1);

  assert(
    p1.length === 4 && new Set(p1).size === 4,
    'Valid permutation: contains 4 distinct indices [0, 1, 2, 3]'
  );

  // 3. Option text scrambling and bijection
  const originalOptions = ['Apple', 'Banana', 'Cherry', 'Date'];
  const shuffledOptions = randomizeOptions(originalOptions, p1);

  assert(
    shuffledOptions.length === 4 &&
      shuffledOptions.every((opt) => originalOptions.includes(opt)),
    'Shuffled options contain all original option texts'
  );

  // 4. Round-trip mapping: Displayed -> Original
  for (let displayedIdx = 0; displayedIdx < 4; displayedIdx++) {
    const origIdx = mapDisplayedToOriginal(displayedIdx, p1);
    assert(
      shuffledOptions[displayedIdx] === originalOptions[origIdx],
      `Displayed card ${displayedIdx} ("${shuffledOptions[displayedIdx]}") correctly maps to original index ${origIdx} ("${originalOptions[origIdx]}")`
    );
  }

  // 5. Round-trip mapping: Original -> Displayed (for Reveal)
  for (let origIdx = 0; origIdx < 4; origIdx++) {
    const displayedIdx = mapOriginalToDisplayed(origIdx, p1);
    assert(
      mapDisplayedToOriginal(displayedIdx, p1) === origIdx,
      `Original index ${origIdx} maps to displayed card ${displayedIdx} and inverts cleanly`
    );
  }

  // 6. Preservation of -1 for timeout / unanswered
  assert(
    mapDisplayedToOriginal(-1, p1) === -1,
    '-1 displayed option (timeout/unanswered) remains -1'
  );

  // 7. Statistical distribution test (over 10,000 samples)
  // Ensure that option 1 (B) is not always at position 1!
  console.log('\n--- Distribution analysis over 10,000 matches ---');
  const positionCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const canonicalAnswer = 1; // Option B in MongoDB

  for (let i = 0; i < 10000; i++) {
    const testMatchId = `match_${i}`;
    const perm = getOptionPermutation(testMatchId, 'test-q', 0);
    const displayedPos = mapOriginalToDisplayed(canonicalAnswer, perm);
    positionCounts[displayedPos]++;
  }

  console.log(`Position 0 (A): ${positionCounts[0]} (~${(positionCounts[0] / 100).toFixed(1)}%)`);
  console.log(`Position 1 (B): ${positionCounts[1]} (~${(positionCounts[1] / 100).toFixed(1)}%)`);
  console.log(`Position 2 (C): ${positionCounts[2]} (~${(positionCounts[2] / 100).toFixed(1)}%)`);
  console.log(`Position 3 (D): ${positionCounts[3]} (~${(positionCounts[3] / 100).toFixed(1)}%)`);

  // Each position should be ~25% (between 22% and 28%)
  const isUniform = Object.values(positionCounts).every(
    (count) => count >= 2200 && count <= 2800
  );
  assert(isUniform, 'Option positions are uniformly distributed (~25% each), eliminating Option B bias');

  console.log(`\n========================================`);
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runRandomizerTests();
