import { NextResponse } from "next/server";
import { z } from "zod";
import { generateGeminiJson, Type, type Schema } from "@/lib/ai/gemini";

// Calls out to the Gemini API — never statically optimized, and the API
// key only ever lives in this server-side module.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_RESUME_CHARS = 8000;
const MAX_JD_CHARS = 4000;

const WRITING_STYLES = ["professional", "formal", "friendly", "enthusiastic", "concise", "executive"] as const;
type WritingStyle = (typeof WRITING_STYLES)[number];

const STYLE_DESCRIPTIONS: Record<WritingStyle, string> = {
  professional: "Clear, polished, and businesslike — confident but not flashy.",
  formal: "Traditional and reserved. Minimal contractions. Respectful and precise.",
  friendly: "Warm and personable while staying professional — approachable, not stiff.",
  enthusiastic: "Genuine energy and excitement about the role and company, without becoming exaggerated or over-the-top.",
  concise: "Short and direct with no filler — cover the essentials in as few words as possible.",
  executive: "Confident, high-level, and outcome-focused — the voice of someone speaking as a peer, not asking for a favor.",
};

const CoverLetterSchema = z.object({
  content: z.string(),
  toneConsistent: z.boolean(),
  grammarCorrect: z.boolean(),
  notes: z.array(z.string()),
});

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    content: { type: Type.STRING },
    toneConsistent: { type: Type.BOOLEAN },
    grammarCorrect: { type: Type.BOOLEAN },
    notes: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["content", "toneConsistent", "grammarCorrect", "notes"],
};

const SYSTEM_PROMPT = `You are writing a cover letter for a candidate, for a personal job-tracking tool. You are given the candidate's already-extracted resume text, a job description, the company name, the job title, and a requested writing style.

What to do:
- Write a complete, professional business-letter-format cover letter (greeting, 3-4 body paragraphs, closing, signed with the candidate's name as it appears on the resume).
- Reference specific skills, projects, and experience that are ALREADY present in the resume text, and connect them naturally to what the job description is asking for.
- Address the letter to the company and role by their EXACT given names — never write a placeholder like "[Company Name]", "[Job Title]", "[Hiring Manager]", or similar bracketed/templated text. If you don't know the hiring manager's name, use a real, non-bracketed greeting like "Dear Hiring Team," instead.
- Match the requested writing style's tone throughout.
- Use plain text only — no markdown formatting, no bullet points, no special symbols. Paragraphs separated by a blank line.

ABSOLUTE RULES — never violate these:
- Never invent, imply, or embellish any experience, skill, project, certification, achievement, company, or metric/number that is not explicitly present in the provided resume text.
- Never state or imply the candidate worked at a company, held a title, or achieved something that isn't in the resume.
- If the resume doesn't have much directly relevant to the role, write a genuine, honest letter with what's actually there — do not fabricate relevant experience to fill the gap.
- Every claim in the letter must be traceable to the resume text given.

After writing the letter, self-assess and report:
- toneConsistent: does the letter maintain one consistent tone matching the requested style throughout, with no jarring shifts?
- grammarCorrect: is the letter free of grammar, spelling, and punctuation errors?
- notes: a short list of anything worth flagging (e.g. "Resume has limited experience directly relevant to this role" or "Kept greeting generic since no hiring manager name was provided") — empty array if nothing stands out.`;

interface RequestBody {
  resumeText?: string;
  jobDescription?: string;
  companyName?: string;
  jobRole?: string;
  writingStyle?: WritingStyle;
}

function unavailable(reason: string, status = 200) {
  return NextResponse.json({ available: false, reason }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return unavailable("AI cover letter generation isn't configured for this deployment (no API key set).");
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return unavailable("Invalid request.", 400);
  }

  const resumeText = (body.resumeText ?? "").trim();
  const jobDescription = (body.jobDescription ?? "").trim();
  const companyName = (body.companyName ?? "").trim();
  const jobRole = (body.jobRole ?? "").trim();
  const writingStyle = body.writingStyle && WRITING_STYLES.includes(body.writingStyle) ? body.writingStyle : null;

  if (!resumeText || !jobDescription || !companyName || !jobRole || !writingStyle) {
    return unavailable("Missing resume, job description, company name, job title, or writing style.", 400);
  }

  const userPrompt = `Company: ${companyName}
Job title: ${jobRole}
Writing style: ${writingStyle} — ${STYLE_DESCRIPTIONS[writingStyle]}

--- JOB DESCRIPTION ---
${jobDescription.slice(0, MAX_JD_CHARS)}

--- RESUME TEXT (the complete, sole source of truth for this candidate) ---
${resumeText.slice(0, MAX_RESUME_CHARS)}`;

  try {
    const raw = await generateGeminiJson({
      apiKey,
      systemInstruction: SYSTEM_PROMPT,
      userPrompt,
      responseSchema: RESPONSE_SCHEMA,
      maxOutputTokens: 2048,
    });
    const result = CoverLetterSchema.parse(raw);
    return NextResponse.json({ available: true, result });
  } catch {
    return unavailable("AI cover letter generation is temporarily unavailable.");
  }
}
