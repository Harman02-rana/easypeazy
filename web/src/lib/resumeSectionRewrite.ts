// Shared by both the resume section editor and the cover letter paragraph
// editor — one endpoint, one style vocabulary, reused across document types.
export const REWRITE_STYLES = ["rewrite", "professional", "shorter", "ats-friendly", "tone", "grammar"] as const;
export type RewriteStyle = (typeof REWRITE_STYLES)[number];

export const REWRITE_STYLE_LABELS: Record<RewriteStyle, string> = {
  rewrite: "AI Rewrite",
  professional: "Make Professional",
  shorter: "Make Concise",
  "ats-friendly": "ATS Friendly",
  tone: "Improve Tone",
  grammar: "Improve Grammar",
};

interface RewriteResponse {
  available: boolean;
  reason?: string;
  result?: { rewrittenText: string };
}

/** Never throws — resolves with `text: null` and a human-readable `reason`
 * on any failure so the caller can show it inline. */
export async function fetchSectionRewrite(params: {
  sectionText: string;
  sectionLabel: string;
  style: RewriteStyle;
  resumeContext?: string;
}): Promise<{ text: string | null; reason: string | null }> {
  try {
    const res = await fetch("/api/rewrite-section", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = (await res.json()) as RewriteResponse;
    if (!data.available || !data.result) {
      return { text: null, reason: data.reason ?? "AI section rewriting is temporarily unavailable." };
    }
    return { text: data.result.rewrittenText, reason: null };
  } catch {
    return { text: null, reason: "Couldn't reach the rewrite service." };
  }
}
