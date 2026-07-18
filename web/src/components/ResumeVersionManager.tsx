"use client";

import { useState } from "react";
import { Copy, Download, Star, Trash2 } from "lucide-react";
import { useResumeVersions } from "@/hooks/useTracker";
import { downloadResumeAsPdf } from "@/lib/pdfExport";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

/** The version list is self-contained — it reads/writes the same
 * `jhp_resume_versions` key as ResumeOptimizerSection's "Save version"
 * action via `useResumeVersions`, and stays in sync through the existing
 * localStorage pub/sub, so the two components don't need to talk directly. */
export default function ResumeVersionManager({ masterResumeText }: { masterResumeText: string }) {
  const { items, hydrated, saveMaster, remove } = useResumeVersions();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!hydrated) return null;

  function handleCopy(content: string, id: string) {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1500);
      })
      .catch(() => {
        // Clipboard permission denied or unavailable — no confirmation shown,
        // which is enough signal that the copy didn't happen.
      });
  }

  return (
    <div className="card-soft p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">Resume versions</p>
        <button onClick={() => saveMaster(masterResumeText)} className="btn-secondary-sm">
          <Star className="h-3.5 w-3.5" strokeWidth={2} />
          Save current resume as Master
        </button>
      </div>

      {items.length === 0 ? (
        <p className="mt-3 text-xs text-muted">No saved versions yet.</p>
      ) : (
        <div className="mt-3 flex flex-col gap-1">
          {items.map((v) => (
            <div key={v.id} className="row-hover flex flex-wrap items-center justify-between gap-2 rounded-lg px-2 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {v.isMaster ? "⭐ Master Resume" : v.label}
                </p>
                <p className="text-xs text-muted">
                  {!v.isMaster && (v.companyName || v.jobRole) && (
                    <>
                      {v.companyName}
                      {v.companyName && v.jobRole ? " · " : ""}
                      {v.jobRole} ·{" "}
                    </>
                  )}
                  {formatDate(v.optimizedAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button onClick={() => handleCopy(v.content, v.id)} className="btn-secondary-sm">
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                  {copiedId === v.id ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={() => downloadResumeAsPdf(v.content, v.label)}
                  aria-label="Download as PDF"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                <button
                  onClick={() => remove(v.id)}
                  aria-label="Delete version"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
