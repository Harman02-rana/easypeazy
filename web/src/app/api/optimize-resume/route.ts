import { NextResponse } from "next/server";
import { z } from "zod";
import { generateGeminiJson, Type, type Schema } from "@/lib/ai/gemini";

// Calls out to the Gemini API — never statically optimized, and the API
// key only ever lives in this server-side module (read from the environment,
// never sent to or bundled for the client).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_RESUME_CHARS = 8000;
const MAX_JD_CHARS = 4000;

const OptimizeSchema = z.object({
  optimizedResume: z.string(),
  changeSummary: z.array(z.string()),
});

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    optimizedResume: { type: Type.STRING },
    changeSummary: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["optimizedResume", "changeSummary"],
};

const SYSTEM_PROMPT = `You are rewriting a candidate's resume text to be better tailored to a specific job description, for a personal job-tracking tool. You are given the candidate's already-extracted resume text, the job description, and (optionally) local ATS match statistics for context.

What to improve:
- Wording, clarity, and readability throughout.
- Action verbs — strengthen weak phrasing (e.g. "worked on" -> "built", "helped with" -> "implemented") ONLY where the stronger verb still accurately describes what the resume already says happened.
- Keyword relevance to the job description — but ONLY by better surfacing or rephrasing skills, tools, and responsibilities that are ALREADY present in the resume text. Never add a skill, tool, or technology the resume doesn't already mention.
- Project and experience descriptions — make existing content clearer and more impactful without adding new claims.
- Surface technical skills already present in the resume that are relevant to this job — do not introduce skills the candidate hasn't listed.
- Preserve a plain-text, ATS-friendly structure: keep the same overall section headings and order as the original, plain text only (no tables, no images, no markdown formatting, no unusual symbols).

ABSOLUTE RULES — never violate these, under any circumstance:
- Never invent, imply, or embellish any experience, skill, project, certification, achievement, or metric/number that is not explicitly present in the original resume text.
- Never change factual information: job titles, company names, dates, degree names, institution names, and any numbers/metrics must stay exactly as given in the original.
- If the resume is missing something the job description wants, leave that gap as a gap — do not fill it in. Your job here is only to improve the presentation of what is real, not to close gaps.
- The optimized resume must remain a completely truthful representation of the same candidate: same experience, same projects, same skills, same education — just better written.

Return the full optimized resume as plain text, matching the original's overall structure and section order, plus a short list of concrete, specific changes you made (e.g. "Rewrote the first bullet under 'Software Engineering Intern' to lead with a stronger action verb", "Reordered the skills list to surface Python and React earlier since the job description emphasizes them"). Do not include commentary outside those two fields.`;

interface RequestBody {
  resumeText?: string;
  jobDescription?: string;
  companyName?: string;
  jobRole?: string;
  analysis?: {
    overallScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
  };
}

function unavailable(reason: string, status = 200) {
  return NextResponse.json({ available: false, reason }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return unavailable("AI resume optimization isn't configured for this deployment (no API key set).");
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return unavailable("Invalid request.", 400);
  }

  const resumeText = (body.resumeText ?? "").trim();
  const jobDescription = (body.jobDescription ?? "").trim();
  if (!resumeText || !jobDescription) {
    return unavailable("Missing resume text or job description.", 400);
  }

  const analysis = body.analysis;
  const analysisSummary = analysis
    ? [
        `Local ATS score: ${analysis.overallScore}/100.`,
        `Skills already matched: ${analysis.matchedSkills.join(", ") || "none"}.`,
        `Skills the JD mentions but the resume doesn't (do NOT add these): ${analysis.missingSkills.join(", ") || "none"}.`,
        `Keywords already matched: ${analysis.matchedKeywords.join(", ") || "none"}.`,
        `Keywords the JD mentions but the resume doesn't (do NOT add these): ${analysis.missingKeywords.join(", ") || "none"}.`,
      ].join("\n")
    : "No local analysis summary provided.";

  const userPrompt = `Company: ${body.companyName || "(not specified)"}
Role: ${body.jobRole || "(not specified)"}

--- JOB DESCRIPTION ---
${jobDescription.slice(0, MAX_JD_CHARS)}

--- ORIGINAL RESUME TEXT (the complete, sole source of truth for this candidate) ---
${resumeText.slice(0, MAX_RESUME_CHARS)}

--- LOCAL ATS ANALYSIS (for context only) ---
${analysisSummary}`;

  try {
    const raw = await generateGeminiJson({
      apiKey,
      systemInstruction: SYSTEM_PROMPT,
      userPrompt,
      responseSchema: RESPONSE_SCHEMA,
      maxOutputTokens: 4096,
    });
    const result = OptimizeSchema.parse(raw);
    return NextResponse.json({ available: true, result });
  } catch {
    // Any API failure (auth, rate limit, network, overloaded) — surface as
    // "unavailable" rather than a 500, so the UI can show a clear message
    // instead of an unhandled error.
    return unavailable("AI resume optimization is temporarily unavailable.");
  }
}
