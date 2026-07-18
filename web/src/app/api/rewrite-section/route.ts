import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

// Calls out to the Anthropic API — never statically optimized, and the API
// key only ever lives in this server-side module.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SECTION_CHARS = 4000;
const MAX_CONTEXT_CHARS = 6000;

// Not exported — Next.js route files may only export HTTP method handlers
// and a small fixed set of config values, so this stays a private mirror
// of the same styles the client-side lib (resumeSectionRewrite.ts) uses.
const REWRITE_STYLES = ["rewrite", "professional", "shorter", "ats-friendly"] as const;
type RewriteStyle = (typeof REWRITE_STYLES)[number];

const STYLE_INSTRUCTIONS: Record<RewriteStyle, string> = {
  rewrite: "Improve clarity, flow, and word choice. Fix awkward phrasing. Keep roughly the same length and level of detail.",
  professional: "Make the tone more polished and professional — formal, confident, and precise, without becoming stiff or robotic.",
  shorter: "Tighten this section significantly. Cut filler words and redundant phrasing. Preserve every distinct fact — do not drop any real detail, just say it more concisely.",
  "ats-friendly": "Rewrite for ATS parsing: plain text only, no special characters or symbols, standard punctuation, and make sure any tools/technologies already mentioned are stated plainly (not buried in dense prose) so keyword scanners pick them up.",
};

const RewriteSchema = z.object({
  rewrittenText: z.string(),
});

const SYSTEM_PROMPT = `You are rewriting ONE section of a candidate's resume, for a personal job-tracking tool. You are given the section's current text, its heading, a style instruction, and — for context only — the surrounding resume.

ABSOLUTE RULES — never violate these:
- Never invent, imply, or embellish any experience, skill, project, certification, achievement, or metric/number that is not explicitly present in the original section text.
- Never change factual information: job titles, company names, dates, degree names, institution names, and any numbers/metrics must stay exactly as given.
- Rewrite ONLY the section text provided. Do not add new bullet points, new sentences describing things not already there, or content copied from other parts of the resume into this section.
- If the section is very short or sparse, keep the rewrite short too — do not pad it out.

Apply the given style instruction to the section text, then return only the rewritten section body (no heading, no commentary, no markdown formatting — plain text, preserving line breaks between bullet points if the original had them).`;

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
  const apiKey = process.env.ANTHROPIC_API_KEY;
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

  const userPrompt = `Section heading: ${sectionLabel}
Style instruction: ${STYLE_INSTRUCTIONS[style]}

--- SECTION TEXT TO REWRITE ---
${sectionText.slice(0, MAX_SECTION_CHARS)}

--- SURROUNDING RESUME (context only — do not pull content from here into the rewrite) ---
${resumeContext.slice(0, MAX_CONTEXT_CHARS) || "(not provided)"}`;

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.parse({
      model: "claude-opus-4-8",
      max_tokens: 1536,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      output_config: { format: zodOutputFormat(RewriteSchema) },
      messages: [{ role: "user", content: userPrompt }],
    });

    if (!response.parsed_output) {
      return unavailable("The rewrite response couldn't be parsed.");
    }

    return NextResponse.json({ available: true, result: response.parsed_output });
  } catch {
    return unavailable("AI section rewriting is temporarily unavailable.");
  }
}
