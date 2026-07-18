import { GoogleGenAI, Type } from "@google/genai";
import type { Schema } from "@google/genai";

// Every AI route in this app calls Gemini through this one module — the
// only place that owns the actual provider integration, so swapping
// providers again later only touches this file, not each route.
export { Type };
export type { Schema };

// "-latest" alias, not a pinned version — Google periodically restricts
// specific dated/versioned models from new API keys (confirmed: a pinned
// "gemini-2.5-flash" 404'd as "no longer available to new users" on this
// key, while this alias resolved fine), so tracking the alias avoids the
// app silently breaking again the same way.
const DEFAULT_MODEL = "gemini-flash-latest";

export class AiUnavailableError extends Error {}

/** Calls Gemini with a JSON response schema and returns the raw parsed
 * JSON (unknown) — callers validate it against their own zod schema so
 * they get the exact same "malformed AI output never reaches the UI"
 * guarantee the previous Anthropic structured-output integration gave for
 * free. Throws AiUnavailableError on any failure (missing key, network,
 * non-2xx, empty/unparseable response) with a message safe to show
 * directly in the UI. */
export async function generateGeminiJson({
  apiKey,
  systemInstruction,
  userPrompt,
  responseSchema,
  maxOutputTokens = 2048,
  model = DEFAULT_MODEL,
}: {
  apiKey: string;
  systemInstruction: string;
  userPrompt: string;
  responseSchema: Schema;
  maxOutputTokens?: number;
  model?: string;
}): Promise<unknown> {
  const ai = new GoogleGenAI({ apiKey });

  let response;
  try {
    response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        maxOutputTokens,
      },
    });
  } catch (err) {
    throw new AiUnavailableError(err instanceof Error ? err.message : "Gemini request failed.");
  }

  const text = response.text;
  if (!text) {
    throw new AiUnavailableError("The AI response was empty.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new AiUnavailableError("The AI response couldn't be parsed.");
  }
}
