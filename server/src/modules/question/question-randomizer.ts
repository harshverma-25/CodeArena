import { createHash } from 'crypto';

/**
 * Question Option Randomizer
 *
 * Provides safe, deterministic runtime option permutation for quiz and battle matches.
 * - Leaves MongoDB question documents and database schemas completely untouched.
 * - Guarantees that all players in the same match receive the exact same option order for each question.
 * - Guarantees that reconnecting players receive the identical option order.
 * - Maps the player's displayed selection back to the canonical answer index for server-authoritative validation.
 * - Maps the canonical correct answer index to the displayed card index during the reveal phase.
 */

/**
 * Generate a deterministic permutation of options [0, 1, ..., length - 1]
 * seeded by (matchId, questionId, roundIndex).
 *
 * @param matchId The unique ID of the match/battle
 * @param questionId The unique ID of the question
 * @param roundIndex The 0-based round index in the match
 * @param length The number of options (default: 4)
 * @returns Array where permutation[displayedIndex] = originalIndex
 */
export function getOptionPermutation(
  matchId: string,
  questionId: string,
  roundIndex: number,
  length: number = 4
): number[] {
  if (length <= 1) {
    return Array.from({ length }, (_, i) => i);
  }

  // Cryptographic SHA-256 digest provides 32 bytes of uniform pseudo-randomness
  const hash = createHash('sha256')
    .update(`${matchId}:${questionId}:${roundIndex}`)
    .digest();

  const permutation = Array.from({ length }, (_, i) => i);

  // Fisher-Yates shuffle
  for (let i = length - 1; i > 0; i--) {
    const byteOffset = (length - 1 - i) * 4;
    const randUint = hash.readUInt32BE(byteOffset % (hash.length - 4));
    const j = randUint % (i + 1);

    const temp = permutation[i];
    permutation[i] = permutation[j];
    permutation[j] = temp;
  }

  return permutation;
}

/**
 * Reorders an options array according to the given permutation.
 *
 * @param originalOptions The canonical 4-option array from MongoDB
 * @param permutation Array where permutation[displayedIndex] = originalIndex
 * @returns Randomized options array for client delivery
 */
export function randomizeOptions(
  originalOptions: string[],
  permutation: number[]
): string[] {
  if (!originalOptions || originalOptions.length !== permutation.length) {
    return originalOptions;
  }
  return permutation.map((origIdx) => originalOptions[origIdx]);
}

/**
 * Translates a displayed option index (what the player clicked on screen)
 * to the original option index in MongoDB.
 *
 * @param displayedOption The 0-based index of the card on the player's screen (or -1 for timeout)
 * @param permutation Array where permutation[displayedIndex] = originalIndex
 * @returns Original option index (0..3) or -1 if unanswered
 */
export function mapDisplayedToOriginal(
  displayedOption: number,
  permutation: number[]
): number {
  if (displayedOption < 0 || displayedOption >= permutation.length) {
    return displayedOption; // Preserve -1 for timeout / unanswered
  }
  return permutation[displayedOption];
}

/**
 * Translates the original correct answer index (0..3 in MongoDB)
 * to the displayed card index on screen during the reveal phase.
 *
 * @param originalOption The canonical correctAnswer (0..3) from MongoDB
 * @param permutation Array where permutation[displayedIndex] = originalIndex
 * @returns Displayed index (0..3) for the client's reveal UI
 */
export function mapOriginalToDisplayed(
  originalOption: number,
  permutation: number[]
): number {
  const displayedIndex = permutation.indexOf(originalOption);
  return displayedIndex !== -1 ? displayedIndex : originalOption;
}
