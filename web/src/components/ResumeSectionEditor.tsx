"use client";

import { useState } from "react";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { parseResumeSections, stringifyResumeSections, type ResumeSection } from "@/lib/resumeSections";
import { fetchSectionRewrite, REWRITE_STYLES, REWRITE_STYLE_LABELS, type RewriteStyle } from "@/lib/resumeSectionRewrite";

export default function ResumeSectionEditor({
  content,
  onSave,
  onCancel,
}: {
  content: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}) {
  const [sections, setSections] = useState<ResumeSection[]>(() => parseResumeSections(content));
  const [busy, setBusy] = useState<{ id: string; style: RewriteStyle } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateBody(id: string, body: string) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, body } : s)));
  }

  async function handleRewrite(section: ResumeSection, style: RewriteStyle) {
    setError(null);
    setBusy({ id: section.id, style });
    const context = stringifyResumeSections(sections.filter((s) => s.id !== section.id));
    const { text, reason } = await fetchSectionRewrite({
      sectionText: section.body,
      sectionLabel: section.heading,
      style,
      resumeContext: context,
    });
    setBusy(null);
    if (!text) {
      setError(reason ?? "AI rewriting is unavailable.");
      return;
    }
    updateBody(section.id, text);
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">
        Edit each section directly, or let AI rewrite just that section — it only rewrites what&apos;s already
        there and never adds new skills, experience, or numbers.
      </p>

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
        {sections.map((section) => (
          <div key={section.id} className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{section.heading}</p>
            <textarea
              value={section.body}
              onChange={(e) => updateBody(section.id, e.target.value)}
              rows={Math.min(10, Math.max(3, section.body.split("\n").length + 1))}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {REWRITE_STYLES.map((style) => {
                const isBusy = busy?.id === section.id && busy.style === style;
                return (
                  <button
                    key={style}
                    onClick={() => handleRewrite(section, style)}
                    disabled={busy !== null}
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

      <div className="flex gap-2">
        <button onClick={() => onSave(stringifyResumeSections(sections))} className="btn-primary">
          Save changes
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}
