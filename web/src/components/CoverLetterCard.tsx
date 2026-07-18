"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Check, Clipboard, Download, Eye, Files, Pencil, Trash2, X } from "lucide-react";
import type { CoverLetter } from "@/lib/trackerTypes";
import { WRITING_STYLE_LABELS } from "@/lib/writingStyleLabels";
import { isReadyToSend } from "@/lib/coverLetterQuality";
import { downloadCoverLetterAsPdf } from "@/lib/coverLetterPdfExport";
import Modal from "./Modal";

// Only ever renders inside a Modal that opens on click — code-split so its
// weight (and the dynamically-imported jsPDF it pulls in) never loads just
// from a card existing on the page.
const CoverLetterPreview = dynamic(() => import("./CoverLetterPreview"));

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function IconButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
    >
      {children}
    </button>
  );
}

export default function CoverLetterCard({
  letter,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: {
  letter: CoverLetter;
  onOpen: () => void;
  onRename: (label: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftLabel, setDraftLabel] = useState(letter.label);
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const ready = isReadyToSend(letter.qualityCheck);

  function handleCopy() {
    navigator.clipboard
      .writeText(letter.content)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {
        // Clipboard permission denied/unavailable — no confirmation shown.
      });
  }

  function commitRename() {
    const trimmed = draftLabel.trim();
    if (trimmed && trimmed !== letter.label) onRename(trimmed);
    setIsRenaming(false);
  }

  return (
    <div className="card-soft flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {isRenaming ? (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                value={draftLabel}
                onChange={(e) => setDraftLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") {
                    setDraftLabel(letter.label);
                    setIsRenaming(false);
                  }
                }}
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-accent"
              />
              <IconButton onClick={commitRename} label="Save name">
                <Check className="h-3.5 w-3.5" strokeWidth={2} />
              </IconButton>
              <IconButton
                onClick={() => {
                  setDraftLabel(letter.label);
                  setIsRenaming(false);
                }}
                label="Cancel rename"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </IconButton>
            </div>
          ) : (
            <p className="truncate text-sm font-semibold text-foreground">{letter.label}</p>
          )}
          <p className="truncate text-xs text-muted">
            {letter.companyName} · {letter.jobRole}
          </p>
        </div>
        {ready ? (
          <span className="badge shrink-0" style={{ backgroundColor: "var(--cat-offer-bg)", color: "var(--cat-offer)" }}>
            Ready
          </span>
        ) : (
          <span className="badge shrink-0" style={{ backgroundColor: "var(--cat-interview-bg)", color: "var(--cat-interview)" }}>
            Review
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="badge" style={{ backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" }}>
          {WRITING_STYLE_LABELS[letter.writingStyle]}
        </span>
        <span className="badge" style={{ backgroundColor: "var(--surface-hover)", color: "var(--muted)" }}>
          {letter.resumeVersionLabel}
        </span>
      </div>

      <p className="text-[11px] text-muted">
        Created {formatDate(letter.createdAt)} · Modified {formatDate(letter.lastModifiedAt)}
      </p>

      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setPreviewOpen(true)} className="btn-secondary-sm">
          <Eye className="h-3.5 w-3.5" strokeWidth={2} />
          Preview
        </button>
        <button onClick={onOpen} className="btn-secondary-sm">
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          Edit
        </button>
        <button onClick={() => downloadCoverLetterAsPdf(letter.content, letter.label)} className="btn-secondary-sm">
          <Download className="h-3.5 w-3.5" strokeWidth={2} />
          PDF
        </button>
      </div>

      <div className="flex items-center gap-1 border-t border-border pt-2">
        <IconButton onClick={handleCopy} label="Copy text to clipboard">
          <Clipboard className="h-3.5 w-3.5" strokeWidth={2} style={copied ? { color: "var(--cat-offer)" } : undefined} />
        </IconButton>
        <IconButton onClick={() => setIsRenaming(true)} label="Rename letter">
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
        </IconButton>
        <IconButton onClick={onDuplicate} label="Duplicate letter">
          <Files className="h-3.5 w-3.5" strokeWidth={2} />
        </IconButton>
        <IconButton onClick={onDelete} label="Delete letter">
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
        </IconButton>
      </div>

      {previewOpen && (
        <Modal onClose={() => setPreviewOpen(false)} title={`Preview — ${letter.label}`}>
          <CoverLetterPreview content={letter.content} />
          <button onClick={() => downloadCoverLetterAsPdf(letter.content, letter.label)} className="btn-primary mt-3">
            <Download className="h-3.5 w-3.5" strokeWidth={2} />
            Download as PDF
          </button>
        </Modal>
      )}
    </div>
  );
}
