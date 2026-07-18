import type { jsPDF } from "jspdf";

const MARGIN = 72; // 1in — standard business letter margin
const LINE_HEIGHT = 16;
const FONT_SIZE = 11;

/** Splits on blank lines into paragraphs, collapsing any internal
 * newlines within a paragraph into spaces (cover letter paragraphs are
 * prose, not line-broken like resume bullets). */
export function splitIntoParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

async function renderPdf(content: string): Promise<jsPDF> {
  // jsPDF is a sizeable dependency — dynamically imported so it only ever
  // loads when someone actually generates a PDF.
  const { jsPDF: JsPdf } = await import("jspdf");
  const doc = new JsPdf({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - MARGIN * 2;
  let y = MARGIN;

  doc.setFont("times", "normal");
  doc.setFontSize(FONT_SIZE);

  function ensureSpace(needed: number) {
    if (y + needed > pageHeight - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  const paragraphs = splitIntoParagraphs(content);
  for (const paragraph of paragraphs) {
    for (const line of doc.splitTextToSize(paragraph, maxWidth) as string[]) {
      ensureSpace(LINE_HEIGHT);
      doc.text(line, MARGIN, y);
      y += LINE_HEIGHT;
    }
    y += LINE_HEIGHT * 0.6; // paragraph spacing
  }

  return doc;
}

function safeFileName(label: string): string {
  return label.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "cover-letter";
}

/** Renders a cover letter into a clean, plain single-column business-
 * letter-format PDF and triggers a download. Same "no tables/columns/
 * images" ATS-friendly philosophy as the resume PDF export, applied to a
 * prose document instead of a structured one. */
export async function downloadCoverLetterAsPdf(content: string, fileLabel: string): Promise<void> {
  const doc = await renderPdf(content);
  doc.save(`${safeFileName(fileLabel)}.pdf`);
}
