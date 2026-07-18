import type { AiInsights, AtsAnalysisResult } from "./trackerTypes";

interface AiInsightsResponse {
  available: boolean;
  reason?: string;
  insights?: Omit<AiInsights, "generatedAt"> & { generatedAt: string };
}

/** Fetches optional AI commentary for an already-computed local analysis.
 * Never throws — any failure (missing API key, network error, rate limit,
 * bad response shape) resolves to `null` so the caller can just skip
 * rendering the AI section. The local analysis is already complete and
 * correct before this is ever called; resumeText is passed separately
 * since it isn't duplicated into every stored AtsAnalysisResult. */
export async function fetchAiInsights(
  resumeText: string,
  analysis: AtsAnalysisResult
): Promise<AiInsights | null> {
  try {
    const res = await fetch("/api/ats-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeText,
        jobDescription: analysis.jobDescription,
        companyName: analysis.companyName,
        jobRole: analysis.jobRole,
        localAnalysis: {
          overallScore: analysis.overallScore,
          categoryScores: analysis.categoryScores.map((c) => ({ label: c.label, score: c.score })),
          matchedSkills: analysis.matchedSkills,
          missingSkills: analysis.missingSkills,
          matchedKeywords: analysis.matchedKeywords,
          missingKeywords: analysis.missingKeywords,
        },
      }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as AiInsightsResponse;
    if (!data.available || !data.insights) return null;

    return data.insights;
  } catch {
    return null;
  }
}
