import type { ResumeFileType } from "./trackerTypes";

export const MAX_RESUME_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export class ResumeParseError extends Error {}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectFileType(file: File): ResumeFileType | null {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return "docx";
  }
  return null;
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageTexts: string[] = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pageTexts.push(pageText);
  }

  return pageTexts.join("\n\n").trim();
}

async function extractDocxText(file: File): Promise<string> {
  const { extractRawText } = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await extractRawText({ arrayBuffer });
  return result.value.trim();
}

/** Validates type/size up front, then dispatches to the matching extractor.
 * Every failure path throws `ResumeParseError` with a message safe to show
 * directly in the UI — callers don't need to inspect the error further. */
export async function extractResumeText(file: File): Promise<{ text: string; fileType: ResumeFileType }> {
  const fileType = detectFileType(file);
  if (!fileType) {
    throw new ResumeParseError("Only PDF and DOCX resumes are supported.");
  }

  if (file.size === 0) {
    throw new ResumeParseError("That file is empty.");
  }

  if (file.size > MAX_RESUME_FILE_BYTES) {
    throw new ResumeParseError("That file is larger than 10 MB — try a smaller resume file.");
  }

  try {
    const text = fileType === "pdf" ? await extractPdfText(file) : await extractDocxText(file);
    if (!text) {
      throw new ResumeParseError(
        "Couldn't find any text in that file — it may be a scanned image rather than a text-based resume."
      );
    }
    return { text, fileType };
  } catch (err) {
    if (err instanceof ResumeParseError) throw err;
    throw new ResumeParseError(
      `Couldn't read that ${fileType.toUpperCase()} file — it may be corrupted or password-protected.`
    );
  }
}
