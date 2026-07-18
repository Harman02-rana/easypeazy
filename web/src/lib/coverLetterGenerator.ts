import type { WritingStyle } from "./trackerTypes";

export interface GeneratedCoverLetter {
  content: string;
  toneConsistent: boolean;
  grammarCorrect: boolean;
  notes: string[];
}

interface GenerateResponse {
  available: boolean;
  reason?: string;
  result?: GeneratedCoverLetter;
}

/** Never throws — resolves with `result: null` and a human-readable
 * `reason` on any failure so the caller can show it inline instead of the
 * page erroring. */
export async function fetchGeneratedCoverLetter(params: {
  resumeText: string;
  jobDescription: string;
  companyName: string;
  jobRole: string;
  writingStyle: WritingStyle;
}): Promise<{ result: GeneratedCoverLetter | null; reason: string | null }> {
  try {
    const res = await fetch("/api/generate-cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = (await res.json()) as GenerateResponse;
    if (!data.available || !data.result) {
      return { result: null, reason: data.reason ?? "AI cover letter generation is temporarily unavailable." };
    }
    return { result: data.result, reason: null };
  } catch {
    return { result: null, reason: "Couldn't reach the generation service." };
  }
}
