import { splitIntoParagraphs } from "@/lib/coverLetterPdfExport";

/** On-screen approximation of the generated PDF — same paragraph-splitting
 * logic as the PDF export, same serif business-letter font, so what's
 * previewed matches what downloads. */
export default function CoverLetterPreview({ content }: { content: string }) {
  const paragraphs = splitIntoParagraphs(content);

  return (
    <div className="overflow-x-auto rounded-lg border border-border p-4" style={{ backgroundColor: "var(--surface-hover)" }}>
      <div
        className="mx-auto shadow-lg"
        style={{
          width: "8.5in",
          minHeight: "11in",
          maxWidth: "100%",
          padding: "1in",
          backgroundColor: "#ffffff",
          color: "#111111",
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: "11pt",
          lineHeight: "1.5",
        }}
      >
        {paragraphs.map((p, i) => (
          <p key={i} style={{ margin: "0 0 14pt" }}>
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
