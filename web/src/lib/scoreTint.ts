/** Shared 0-100 score → color mapping, reused everywhere a score needs a
 * quick visual read (ATS score, resume health, per-category bars). */
export function scoreTint(score: number): { text: string; bg: string } {
  if (score >= 75) return { text: "var(--cat-offer)", bg: "var(--cat-offer-bg)" };
  if (score >= 50) return { text: "var(--cat-interview)", bg: "var(--cat-interview-bg)" };
  return { text: "var(--cat-rejected)", bg: "var(--cat-rejected-bg)" };
}
