import { getResumeTemplate } from "@/lib/resumeTemplates";
import { isLikelyHeadingLine, looksLikeContactLine, normalizeResumeLines } from "@/lib/pdfExport";
import type { ResumeTemplateId } from "@/lib/trackerTypes";

const FONT_STACK: Record<string, string> = {
  helvetica: "Helvetica, Arial, sans-serif",
  times: "'Times New Roman', Times, serif",
  courier: "'Courier New', Courier, monospace",
};

/** An on-screen approximation of the generated PDF — same heading/contact
 * detection and the same template metrics as pdfExport.ts, rendered as
 * HTML instead of PDF draw calls. Not pixel-identical to the PDF (the two
 * renderers are fundamentally different engines), but faithful to the same
 * font, size, and structure choices so it's a trustworthy preview. */
export default function ResumePdfPreview({
  content,
  templateId,
}: {
  content: string;
  templateId: ResumeTemplateId;
}) {
  const template = getResumeTemplate(templateId);
  const lines = normalizeResumeLines(content);

  let isFirstLine = true;
  let inContactArea = true;

  return (
    <div className="overflow-x-auto rounded-lg border border-border p-4" style={{ backgroundColor: "var(--surface-hover)" }}>
      <div
        className="mx-auto shadow-lg"
        style={{
          width: "8.5in",
          minHeight: "11in",
          maxWidth: "100%",
          padding: `${template.marginPt / 72}in`,
          backgroundColor: "#ffffff",
          color: "#111111",
          fontFamily: FONT_STACK[template.font],
          fontSize: `${template.bodyFontSize}pt`,
          lineHeight: `${template.lineHeight}pt`,
        }}
      >
        {lines.map((line, i) => {
          if (line === "") {
            return <div key={i} style={{ height: `${template.lineHeight * 0.5}pt` }} />;
          }

          if (isFirstLine) {
            isFirstLine = false;
            return (
              <p
                key={i}
                style={{ textAlign: "center", fontWeight: 700, fontSize: `${template.nameFontSize}pt`, margin: "0 0 4pt" }}
              >
                {line}
              </p>
            );
          }

          if (inContactArea && looksLikeContactLine(line)) {
            return (
              <p key={i} style={{ textAlign: "center", fontSize: `${template.bodyFontSize}pt`, color: "#555", margin: "0 0 6pt" }}>
                {line}
              </p>
            );
          }
          inContactArea = false;

          if (isLikelyHeadingLine(line)) {
            return (
              <div key={i} style={{ marginTop: "10pt" }}>
                <p style={{ fontWeight: 700, fontSize: `${template.headingFontSize}pt`, textTransform: "uppercase", margin: 0 }}>
                  {line}
                </p>
                <div style={{ borderBottom: "1px solid #bbb", margin: "2pt 0 4pt" }} />
              </div>
            );
          }

          return (
            <p key={i} style={{ margin: 0 }}>
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}
