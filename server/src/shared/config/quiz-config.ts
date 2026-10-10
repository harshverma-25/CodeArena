/**
 * Quiz Configuration Constants & Rules
 * Single Source of Truth for Question Counts and Category Timers
 */

export const QUESTION_COUNT_OPTIONS = [10, 15, 20] as const;
export type QuestionCountOption = typeof QUESTION_COUNT_OPTIONS[number];
export const DEFAULT_QUESTION_COUNT: QuestionCountOption = 10;

/**
 * Category-based Timer Rules (in seconds)
 * - Programming -> 30s
 * - Aptitude -> 60s
 * - General Knowledge -> 30s
 * - Default -> 30s
 */
export const CATEGORY_TIMER_MAP: Record<string, number> = {
  programming: 30,
  aptitude: 60,
  'general-knowledge': 30,
  gk: 30,
  science: 30,
};

export const DEFAULT_TIME_LIMIT = 30;

/**
 * Supported Multiplayer Timer Options (in seconds per question)
 */
export const MULTIPLAYER_TIMER_OPTIONS = [10, 20, 30] as const;
export type MultiplayerTimerOption = typeof MULTIPLAYER_TIMER_OPTIONS[number];
export const DEFAULT_MULTIPLAYER_TIME_LIMIT: MultiplayerTimerOption = 30;

/**
 * Validates whether a given value is one of the allowed multiplayer time limits (10, 20, 30 seconds).
 */
export function isValidMultiplayerTimeLimit(val: unknown): val is MultiplayerTimerOption {
  return typeof val === 'number' && (MULTIPLAYER_TIMER_OPTIONS as readonly number[]).includes(val);
}

/**
 * Derives the server-authoritative timer limit for a given category slug or ID.
 */
export function getCategoryTimeLimit(categorySlugOrId?: string | null): number {
  if (!categorySlugOrId) return DEFAULT_TIME_LIMIT;
  const normalized = categorySlugOrId.trim().toLowerCase();
  return CATEGORY_TIMER_MAP[normalized] ?? DEFAULT_TIME_LIMIT;
}

/**
 * Validates whether a given question count is allowed (10, 15, or 20).
 * In test environment (NODE_ENV === 'test'), allows any valid positive count <= 30 for fast integration tests.
 */
export function isValidQuestionCount(count: unknown): count is number {
  if (typeof count !== 'number') return false;
  if (process.env.NODE_ENV === 'test') {
    return count > 0 && count <= 30 && Number.isInteger(count);
  }
  return QUESTION_COUNT_OPTIONS.includes(count as any);
}

/**
 * Returns the list of standard quiz lengths [10, 15, 20] that can be satisfied
 * by the given published question count.
 * - < 10 questions -> []
 * - 10-14 questions -> [10]
 * - 15-19 questions -> [10, 15]
 * - >= 20 questions -> [10, 15, 20]
 */
export function getAvailableQuizLengths(publishedCount: number): number[] {
  if (typeof publishedCount !== 'number' || publishedCount < 0) return [];
  return QUESTION_COUNT_OPTIONS.filter((opt) => publishedCount >= opt);
}
