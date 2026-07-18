import type { CoverLetterQualityCheck } from "./trackerTypes";

const PLACEHOLDER_PATTERN = /\[[^\]]{2,50}\]|\{\{[^}]+\}\}|\bXXXX+\b|\bTODO\b|\blorem ipsum\b/i;

export function hasPlaceholderText(content: string): boolean {
  return PLACEHOLDER_PATTERN.test(content);
}

function mentions(content: string, needle: string): boolean {
  const trimmed = needle.trim();
  if (!trimmed) return true; // nothing to check against — don't penalize
  return content.toLowerCase().includes(trimmed.toLowerCase());
}

/** Deterministic checks computed from the actual generated text — a
 * ground-truth companion to the AI's own tone/grammar self-assessment
 * (see the generation route), the same "local engine + optional AI"
 * split used throughout this app. Feeds the "Ready to Send" indicator. */
export function runLocalQualityChecks(params: {
  content: string;
  companyName: string;
  jobRole: string;
  aiToneConsistent: boolean;
  aiGrammarCorrect: boolean;
  aiNotes: string[];
}): CoverLetterQualityCheck {
  return {
    companyNameMentioned: mentions(params.content, params.companyName),
    jobTitleMentioned: mentions(params.content, params.jobRole),
    noPlaceholderText: !hasPlaceholderText(params.content),
    toneConsistent: params.aiToneConsistent,
    grammarCorrect: params.aiGrammarCorrect,
    notes: params.aiNotes,
  };
}

export function isReadyToSend(check: CoverLetterQualityCheck | null): boolean {
  if (!check) return false;
  return (
    check.companyNameMentioned &&
    check.jobTitleMentioned &&
    check.noPlaceholderText &&
    check.toneConsistent &&
    check.grammarCorrect
  );
}
