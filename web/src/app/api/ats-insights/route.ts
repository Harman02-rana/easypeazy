import { NextResponse } from "next/server";
import { z } from "zod";
import { generateGeminiJson, Type, type Schema } from "@/lib/ai/gemini";

// Calls out to the Gemini API — never statically optimized, and the API
// key only ever lives in this server-side module (read from the environment,
// never sent to or bundled for the client).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_RESUME_CHARS = 6000;
const MAX_JD_CHARS = 4000;

const InsightsSchema = z.object({
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  roleRelevance: z.string(),
  suggestions: z.array(z.string()),
});

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    roleRelevance: { type: Type.STRING },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["strengths", "weaknesses", "roleRelevance", "suggestions"],
};

const SYSTEM_PROMPT = `You are helping analyze a candidate's resume against a job description for a personal job-tracking tool. You are given the candidate's already-extracted resume text, the job description, and pre-computed match statistics from a separate local scoring engine (skills and keywords matched/missing, per-category scores).

Your job is ONLY to:
1. Describe strengths already present in the resume that are relevant to this role.
2. Describe weak areas or gaps relative to this role.
3. Give a one-to-two sentence assessment of overall role relevance.
4. Give contextual, actionable improvement suggestions.

STRICT RULES — follow these exactly:
- Do not invent, assume, embellish, or imply any skill, experience, project, achievement, or qualification that is not explicitly present in the provided resume text. Every claim must be traceable to the resume text given.
- Do not generate, state, or imply a numeric compatibility score of any kind, in any field — a separate local system already computed and owns that score. Your job is qualitative commentary only.
- If the resume text is sparse or unclear on a point, say so rather than guessing.
- Be specific and concrete — reference actual content from the resume and job description rather than generic advice.`;

interface RequestBody {
  resumeText?: string;
  jobDescription?: string;
  companyName?: string;
  jobRole?: string;
  localAnalysis?: {
    overallScore: number;
    categoryScores: { label: string; score: number }[];
    matchedSkills: string[];
    missingSkills: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
  };
}

function unavailable(reason: string) {
  return NextResponse.json({ available: false, reason });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return unavailable("AI insights aren't configured for this deployment (no API key set).");
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ available: false, reason: "Invalid request." }, { status: 400 });
  }

  const resumeText = (body.resumeText ?? "").trim();
  const jobDescription = (body.jobDescription ?? "").trim();
  if (!resumeText || !jobDescription) {
    return NextResponse.json(
      { available: false, reason: "Missing resume text or job description." },
      { status: 400 }
    );
  }

  const local = body.localAnalysis;
  const localSummary = local
    ? [
        `Overall local score: ${local.overallScore}/100.`,
        `Category scores: ${local.categoryScores.map((c) => `${c.label} ${c.score}/100`).join(", ")}.`,
        `Skills already matched: ${local.matchedSkills.join(", ") || "none"}.`,
        `Skills the JD mentions but the resume doesn't: ${local.missingSkills.join(", ") || "none"}.`,
        `Keywords already matched: ${local.matchedKeywords.join(", ") || "none"}.`,
        `Keywords the JD mentions but the resume doesn't: ${local.missingKeywords.join(", ") || "none"}.`,
      ].join("\n")
    : "No local analysis summary provided.";

  const userPrompt = `Company: ${body.companyName || "(not specified)"}
Role: ${body.jobRole || "(not specified)"}

--- JOB DESCRIPTION ---
${jobDescription.slice(0, MAX_JD_CHARS)}

--- RESUME TEXT (already extracted, this is the full source of truth for what the candidate has) ---
${resumeText.slice(0, MAX_RESUME_CHARS)}

--- LOCAL SCORING ENGINE OUTPUT (for context only — do not repeat or restate the score) ---
${localSummary}`;

  try {
    const raw = await generateGeminiJson({
      apiKey,
      systemInstruction: SYSTEM_PROMPT,
      userPrompt,
      responseSchema: RESPONSE_SCHEMA,
      maxOutputTokens: 1536,
    });
    const parsed = InsightsSchema.parse(raw);

    return NextResponse.json({
      available: true,
      insights: { ...parsed, generatedAt: new Date().toISOString() },
    });
  } catch {
    // Any API failure (auth, rate limit, network, overloaded) — the local
    // analyzer already produced a complete result, so this just means the
    // AI section quietly doesn't render rather than the page erroring.
    return unavailable("AI insights are temporarily unavailable.");
  }
}
