export interface OptimizedResumeResult {
  optimizedResume: string;
  changeSummary: string[];
}

interface OptimizeResponse {
  available: boolean;
  reason?: string;
  result?: OptimizedResumeResult;
}

/** Calls the server-side optimizer route. Never throws — any failure
 * (missing API key, network error, rate limit, bad response shape)
 * resolves with `result: null` and a human-readable `reason` so the
 * caller can show it inline instead of crashing the page. */
export async function fetchOptimizedResume(params: {
  resumeText: string;
  jobDescription: string;
  companyName?: string;
  jobRole?: string;
  analysis?: {
    overallScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
  };
}): Promise<{ result: OptimizedResumeResult | null; reason: string | null }> {
  try {
    const res = await fetch("/api/optimize-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = (await res.json()) as OptimizeResponse;
    if (!data.available || !data.result) {
      return { result: null, reason: data.reason ?? "AI resume optimization is temporarily unavailable." };
    }
    return { result: data.result, reason: null };
  } catch {
    return { result: null, reason: "Couldn't reach the optimization service." };
  }
}
