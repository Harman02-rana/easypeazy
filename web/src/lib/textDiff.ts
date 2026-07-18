import { diffWords, type Change } from "diff";

/** Word-level diff between the original and AI-optimized resume text, used
 * to render the side-by-side highlighted comparison. Thin wrapper so
 * components import from our own lib rather than reaching into `diff`
 * directly — keeps the diffing library swappable later if needed. */
export function diffResumeText(original: string, optimized: string): Change[] {
  return diffWords(original, optimized);
}
