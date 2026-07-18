"use client";

import { useRef, useState } from "react";
import { AlertCircle, Loader2, Redo2, Sparkles, Undo2 } from "lucide-react";
import { fetchSectionRewrite, REWRITE_STYLES, REWRITE_STYLE_LABELS, type RewriteStyle } from "@/lib/resumeSectionRewrite";
import { splitIntoParagraphs } from "@/lib/coverLetterPdfExport";

const paragraphsEqual = (a: string[], b: string[]) => a.length === b.length && a.every((p, i) => p === b[i]);

/** Uncontrolled by design — takes `initialContent` once and owns all
 * editing state itself (paragraphs, undo/redo history). The parent is
 * expected to remount this with a fresh `key` when switching to a
 * different letter, rather than trying to sync a `content` prop back in —
 * far simpler than reconciling external updates against local edit/undo
 * state. `onContentChange` fires on every edit so the parent can draft-
 * hold or auto-save, whichever fits where this is mounted. */
export default function CoverLetterEditor({
  initialContent,
  onContentChange,
  companyName,
  jobRole,
}: {
  initialContent: string;
  onContentChange: (content: string) => void;
  companyName: string;
  jobRole: string;
}) {
  const [paragraphs, setParagraphs] = useState<string[]>(() => splitIntoParagraphs(initialContent));
  const historyRef = useRef<string[][]>([paragraphs]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [busyIndex, setBusyIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function pushHistoryIfChanged(next: string[]) {
    const last = historyRef.current[historyIndex];
    if (paragraphsEqual(last, next)) return;
    const truncated = historyRef.current.slice(0, historyIndex + 1);
    truncated.push(next);
    historyRef.current = truncated;
    setHistoryIndex(truncated.length - 1);
  }

  function updateParagraph(index: number, value: string) {
    const next = paragraphs.slice();
    next[index] = value;
    setParagraphs(next);
    onContentChange(next.join("\n\n"));
    // History is pushed on blur, not per keystroke — an undo step per
    // finished edit reads far better than one per character typed.
  }

  function handleBlur() {
    pushHistoryIfChanged(paragraphs);
  }

  function jumpTo(index: number) {
    const snapshot = historyRef.current[index];
    setParagraphs(snapshot);
    onContentChange(snapshot.join("\n\n"));
    setHistoryIndex(index);
  }

  async function handleRewrite(index: number, style: RewriteStyle) {
    setError(null);
    setBusyIndex(index);
    const context = paragraphs.filter((_, i) => i !== index).join("\n\n");
    const { text, reason } = await fetchSectionRewrite({
      sectionText: paragraphs[index],
      sectionLabel: `Cover letter paragraph ${index + 1} of a letter to ${companyName || "the company"} for ${jobRole || "the role"}`,
      style,
      resumeContext: context,
    });
    setBusyIndex(null);
    if (!text) {
      setError(reason ?? "AI rewriting is unavailable.");
      return;
    }
    const next = paragraphs.slice();
    next[index] = text;
    setParagraphs(next);
    onContentChange(next.join("\n\n"));
    pushHistoryIfChanged(next);
  }

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < historyRef.current.length - 1;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <button onClick={() => canUndo && jumpTo(historyIndex - 1)} disabled={!canUndo} className="btn-secondary-sm">
          <Undo2 className="h-3.5 w-3.5" strokeWidth={2} />
          Undo
        </button>
        <button onClick={() => canRedo && jumpTo(historyIndex + 1)} disabled={!canRedo} className="btn-secondary-sm">
          <Redo2 className="h-3.5 w-3.5" strokeWidth={2} />
          Redo
        </button>
      </div>

      {error && (
        <div
          className="flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--cat-rejected)", backgroundColor: "var(--cat-rejected-bg)", color: "var(--cat-rejected)" }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <div key={i} className="rounded-lg border border-border p-3">
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted">Paragraph {i + 1}</p>
            <textarea
              value={p}
              onChange={(e) => updateParagraph(i, e.target.value)}
              onBlur={handleBlur}
              rows={Math.min(8, Math.max(3, Math.ceil(p.length / 70) + 1))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {REWRITE_STYLES.map((style) => {
                const isBusy = busyIndex === i;
                return (
                  <button
                    key={style}
                    onClick={() => handleRewrite(i, style)}
                    disabled={busyIndex !== null}
                    className="btn-secondary-sm"
                  >
                    {isBusy ? (
                      <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
                    ) : (
                      <Sparkles className="h-3 w-3" strokeWidth={2} />
                    )}
                    {REWRITE_STYLE_LABELS[style]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
