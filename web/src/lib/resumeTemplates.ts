import type { ResumeTemplateId } from "./trackerTypes";

export interface ResumeTemplate {
  id: ResumeTemplateId;
  name: string;
  description: string;
  /** jsPDF built-in fonts only (helvetica/times/courier) — no custom font
   * embedding, which keeps every template a single-column, plain-text
   * layout that real ATS parsers can actually read. "ATS-friendly" ruled
   * out fancy multi-column templates by definition, not just by choice. */
  font: "helvetica" | "times" | "courier";
  bodyFontSize: number;
  nameFontSize: number;
  headingFontSize: number;
  lineHeight: number;
  marginPt: number;
}

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic ATS",
    description: "Clean sans-serif with generous spacing — the safest default for ATS parsing.",
    font: "helvetica",
    bodyFontSize: 10.5,
    nameFontSize: 16,
    headingFontSize: 11.5,
    lineHeight: 14,
    marginPt: 54,
  },
  {
    id: "compact",
    name: "Compact",
    description: "Tighter line spacing and smaller margins to fit more onto fewer pages.",
    font: "helvetica",
    bodyFontSize: 9.5,
    nameFontSize: 14,
    headingFontSize: 10.5,
    lineHeight: 12,
    marginPt: 42,
  },
  {
    id: "modern",
    name: "Modern Serif",
    description: "A traditional serif look with slightly more breathing room.",
    font: "times",
    bodyFontSize: 11,
    nameFontSize: 17,
    headingFontSize: 12,
    lineHeight: 15,
    marginPt: 54,
  },
];

export function getResumeTemplate(id: ResumeTemplateId): ResumeTemplate {
  return RESUME_TEMPLATES.find((t) => t.id === id) ?? RESUME_TEMPLATES[0];
}
