/** The header widget's daily goal — plain data, same pattern as
 * milestoneMessages.ts's MOTIVATION_CORNER_MESSAGES. Edit this list to
 * change what shows up; the rotation itself never needs to change. */

export const DAILY_GOALS: string[] = [
  "Apply to 2 Jobs",
  "Complete 1 OA",
  "Review Resume",
  "Revise 1 DSA Topic",
  "Update LinkedIn",
  "Read 1 Interview Experience",
];

/** Deterministic by day of year, so it doesn't need its own storage key and
 * stays the same across every reload of the same day. */
export function todaysGoal(referenceDate: Date = new Date()): string {
  const start = new Date(referenceDate.getFullYear(), 0, 0);
  const diff = referenceDate.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DAILY_GOALS[dayOfYear % DAILY_GOALS.length];
}
