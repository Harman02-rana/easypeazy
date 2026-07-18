import type { jsPDF } from "jspdf";
import { getResumeTemplate, type ResumeTemplate } from "./resumeTemplates";
import type { ResumeTemplateId } from "./trackerTypes";

const CONTACT_LINE_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|\+?\d[\d\s-]{8,}\d/i;
const KNOWN_HEADINGS_PATTERN =
  /^(experience|work experience|professional experience|internships?|education|skills|technical skills|projects?|certifications?|achievements?|summary|objective|profile|contact|awards?|publications?|languages?|interests?|extracurriculars?|volunteer(ing)?)\b/i;

/** Shared with the on-screen preview so the two never drift apart — a line
 * "looks like a heading" if it's short, doesn't end like a sentence, and
 * either names a common resume section or is a short all-caps line. */
export function isLikelyHeadingLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 40) return false;
  if (/[.:;,]$/.test(trimmed)) return false;
  if (KNOWN_HEADINGS_PATTERN.test(trimmed)) return true;
  const isShortAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed) && trimmed.split(/\s+/).length <= 5;
  return isShortAllCaps;
}

export function looksLikeContactLine(line: string): boolean {
  return CONTACT_LINE_PATTERN.test(line);
}

/** Collapses the raw extracted text into trimmed, non-duplicate-blank
 * lines — shared by the PDF renderer and the on-screen preview. */
export function normalizeResumeLines(content: string): string[] {
  const lines = content.split("\n").map((l) => l.trim());
  const result: string[] = [];
  for (const line of lines) {
    if (line === "" && result[result.length - 1] === "") continue;
    result.push(line);
  }
  return result;
}

async function renderPdf(content: string, template: ResumeTemplate): Promise<jsPDF> {
  // jsPDF is a sizeable dependency — dynamically imported so it only ever
  // loads when someone actually generates a PDF, not on every visit to a
  // page that merely has the download button available.
  const { jsPDF: JsPdf } = await import("jspdf");
  const doc = new JsPdf({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - template.marginPt * 2;
  let y = template.marginPt;
  let isFirstLine = true;
  let inContactArea = true;

  function ensureSpace(needed: number) {
    if (y + needed > pageHeight - template.marginPt) {
      doc.addPage();
      y = template.marginPt;
    }
  }

  for (const line of normalizeResumeLines(content)) {
    if (line === "") {
      y += template.lineHeight * 0.5;
      continue;
    }

    if (isFirstLine) {
      isFirstLine = false;
      doc.setFont(template.font, "bold");
      doc.setFontSize(template.nameFontSize);
      ensureSpace(template.nameFontSize);
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += template.nameFontSize + 6;
      continue;
    }

    if (inContactArea && looksLikeContactLine(line)) {
      doc.setFont(template.font, "normal");
      doc.setFontSize(template.bodyFontSize);
      ensureSpace(template.lineHeight);
      doc.text(line, pageWidth / 2, y, { align: "center" });
      y += template.lineHeight + 6;
      continue;
    }
    inContactArea = false;

    if (isLikelyHeadingLine(line)) {
      y += template.lineHeight * 0.4;
      ensureSpace(template.headingFontSize + 6);
      doc.setFont(template.font, "bold");
      doc.setFontSize(template.headingFontSize);
      doc.text(line.toUpperCase(), template.marginPt, y);
      y += template.headingFontSize * 0.35;
      doc.setDrawColor(180);
      doc.line(template.marginPt, y, pageWidth - template.marginPt, y);
      y += template.lineHeight * 0.9;
      continue;
    }

    doc.setFont(template.font, "normal");
    doc.setFontSize(template.bodyFontSize);
    for (const wrapped of doc.splitTextToSize(line, maxWidth) as string[]) {
      ensureSpace(template.lineHeight);
      doc.text(wrapped, template.marginPt, y);
      y += template.lineHeight;
    }
  }

  return doc;
}

/** Builds the PDF document without saving it — used by both the download
 * button and (in future) anything that wants the raw PDF bytes instead of
 * triggering a browser download. */
export async function generateResumePdf(content: string, templateId: ResumeTemplateId = "classic"): Promise<jsPDF> {
  return renderPdf(content, getResumeTemplate(templateId));
}

function safeFileName(label: string): string {
  return label.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "resume";
}

/** Renders plain resume text into a paginated, template-styled PDF and
 * triggers a download. Deliberately plain (one font, no columns/tables/
 * images) — the whole point is to stay ATS-friendly, not to look fancy. */
export async function downloadResumeAsPdf(content: string, fileLabel: string, templateId: ResumeTemplateId = "classic"): Promise<void> {
  const doc = await generateResumePdf(content, templateId);
  doc.save(`${safeFileName(fileLabel)}.pdf`);
}
