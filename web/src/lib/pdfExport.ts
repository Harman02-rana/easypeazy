import { jsPDF } from "jspdf";

const MARGIN = 54; // 0.75in in points
const LINE_HEIGHT = 14;
const FONT_SIZE = 10.5;

/** Renders plain resume text into a paginated PDF and triggers a download.
 * Deliberately plain (one font, no columns/tables) — the whole point is to
 * stay ATS-friendly, not to look fancy. */
export function downloadResumeAsPdf(content: string, fileLabel: string): void {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - MARGIN * 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT_SIZE);

  let y = MARGIN;
  for (const paragraph of content.split("\n")) {
    const lines: string[] = paragraph.length === 0 ? [""] : doc.splitTextToSize(paragraph, maxWidth);
    for (const line of lines) {
      if (y > pageHeight - MARGIN) {
        doc.addPage();
        y = MARGIN;
      }
      doc.text(line, MARGIN, y);
      y += LINE_HEIGHT;
    }
  }

  const safeName = fileLabel.replace(/[^a-z0-9-_]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "resume";
  doc.save(`${safeName}.pdf`);
}
