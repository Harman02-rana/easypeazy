import { NextResponse } from "next/server";
import { z } from "zod";
import { generateGeminiJson, Type, type Schema } from "@/lib/ai/gemini";

// Calls out to the Gemini API — never statically optimized, and the API
// key only ever lives in this server-side module.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SECTION_CHARS = 4000;
const MAX_CONTEXT_CHARS = 6000;

// Not exported — Next.js route files may only export HTTP method handlers
// and a small fixed set of config values, so this stays a private mirror
// of the same styles the client-side libs (resumeSectionRewrite.ts) use.
// Shared between the resume section editor AND the cover letter paragraph
// editor — one rewrite endpoint, two document types, same guarantees.
const REWRITE_STYLES = ["rewrite", "professional", "shorter", "ats-friendly", "tone", "grammar"] as const;
type RewriteStyle = (typeof REWRITE_STYLES)[number];

const STYLE_INSTRUCTIONS: Record<RewriteStyle, string> = {
  rewrite: "Improve clarity, flow, and word choice. Fix awkward phrasing. Keep roughly the same length and level of detail.",
  professional: "Make the tone more polished and professional — formal, confident, and precise, without becoming stiff or robotic.",
  shorter: "Tighten this text significantly. Cut filler words and redundant phrasing. Preserve every distinct fact — do not drop any real detail, just say it more concisely.",
  "ats-friendly": "Rewrite for ATS parsing: plain text only, no special characters or symbols, standard punctuation, and make sure any tools/technologies already mentioned are stated plainly (not buried in dense prose) so keyword scanners pick them up.",
  tone: "Adjust the tone to be warmer, more engaging, and more natural without changing the facts or structure — smooth out anything that reads stiff, awkward, or overly robotic.",
  grammar: "Fix grammar, punctuation, and spelling issues only. Do not change the meaning, tone, word choice, or structure beyond what's needed to correct the error — this is a proofreading pass, not a rewrite.",
};

const RewriteSchema = z.object({
  rewrittenText: z.string(),
});

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    rewrittenText: { type: Type.STRING },
  },
  required: ["rewrittenText"],
};

const SYSTEM_PROMPT = `You are rewriting ONE section of a candidate's resume or ONE paragraph of their cover letter, for a personal job-tracking tool. You are given the text's current content, its heading or role, a style instruction, and — for context only — the surrounding document.

ABSOLUTE RULES — never violate these:
- Never invent, imply, or embellish any experience, skill, project, certification, achievement, company, or metric/number that is not explicitly present in the original text.
- Never change factual information: job titles, company names, dates, degree names, institution names, and any numbers/metrics must stay exactly as given.
- Rewrite ONLY the text provided. Do not add new bullet points, new sentences describing things not already there, or content copied from elsewhere in the surrounding document into this text.
- If the text is very short or sparse, keep the rewrite short too — do not pad it out.

Apply the given style instruction to the text, then return only the rewritten text (no heading, no commentary, no markdown formatting — plain text, preserving line breaks between bullet points or paragraphs if the original had them).`;

interface RequestBody {
  sectionText?: string;
  sectionLabel?: string;
  style?: RewriteStyle;
  resumeContext?: string;
}

function unavailable(reason: string, status = 200) {
  return NextResponse.json({ available: false, reason }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return unavailable("AI section rewriting isn't configured for this deployment (no API key set).");
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return unavailable("Invalid request.", 400);
  }

  const sectionText = (body.sectionText ?? "").trim();
  const style = body.style && REWRITE_STYLES.includes(body.style) ? body.style : null;
  if (!sectionText || !style) {
    return unavailable("Missing section text or a valid style.", 400);
  }

  const sectionLabel = (body.sectionLabel ?? "Section").trim();
  const resumeContext = (body.resumeContext ?? "").trim();

  const userPrompt = `Section/paragraph label: ${sectionLabel}
Style instruction: ${STYLE_INSTRUCTIONS[style]}

--- TEXT TO REWRITE ---
${sectionText.slice(0, MAX_SECTION_CHARS)}

--- SURROUNDING DOCUMENT (context only — do not pull content from here into the rewrite) ---
${resumeContext.slice(0, MAX_CONTEXT_CHARS) || "(not provided)"}`;

  try {
    const raw = await generateGeminiJson({
      apiKey,
      systemInstruction: SYSTEM_PROMPT,
      userPrompt,
      responseSchema: RESPONSE_SCHEMA,
      maxOutputTokens: 1536,
    });
    const result = RewriteSchema.parse(raw);
    return NextResponse.json({ available: true, result });
  } catch {
    return unavailable("AI section rewriting is temporarily unavailable.");
  }
}
