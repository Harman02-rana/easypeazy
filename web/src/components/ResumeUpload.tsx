"use client";

import { useCallback, useRef, useState } from "react";
import { AlertCircle, Loader2, UploadCloud } from "lucide-react";
import { extractResumeText, ResumeParseError } from "@/lib/resumeParser";
import type { ResumeRecord } from "@/lib/trackerTypes";

export default function ResumeUpload({
  onUploaded,
  compact = false,
}: {
  onUploaded: (record: ResumeRecord) => void;
  /** Smaller "replace resume" variant instead of the full first-time card. */
  compact?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsParsing(true);
      try {
        const { text, fileType } = await extractResumeText(file);
        onUploaded({
          fileName: file.name,
          fileSize: file.size,
          lastModified: file.lastModified,
          fileType,
          extractedText: text,
          uploadedAt: new Date().toISOString(),
        });
      } catch (err) {
        setError(
          err instanceof ResumeParseError
            ? err.message
            : "Something went wrong reading that file. Please try again."
        );
      } finally {
        setIsParsing(false);
      }
    },
    [onUploaded]
  );

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  return (
    <div>
      <div
        onClick={() => !isParsing && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload resume"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors ${
          compact ? "px-4 py-6" : "px-6 py-14"
        } ${isDragging ? "border-accent" : "border-border hover:border-border-strong"}`}
        style={{
          backgroundColor: isDragging ? "var(--accent-soft-bg)" : "var(--surface)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={onPick}
          className="hidden"
        />

        {isParsing ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--accent)" }} strokeWidth={2} />
            <p className="mt-3 text-sm font-medium text-foreground">Reading your resume...</p>
          </>
        ) : (
          <>
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" }}
            >
              <UploadCloud className="h-5 w-5" strokeWidth={2} />
            </span>
            <p className="mt-3 text-sm font-medium text-foreground">
              {compact ? "Drop a new resume, or click to browse" : "Drag & drop your resume here"}
            </p>
            {!compact && <p className="mt-1 text-xs text-muted">or click to browse</p>}
            <p className="mt-2 text-xs text-muted">PDF or DOCX, up to 10 MB</p>
          </>
        )}
      </div>

      {error && (
        <div
          className="mt-3 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--cat-rejected)", backgroundColor: "var(--cat-rejected-bg)", color: "var(--cat-rejected)" }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
