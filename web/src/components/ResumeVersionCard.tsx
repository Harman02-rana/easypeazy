"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Check,
  Clipboard,
  Download,
  Eye,
  Files,
  Layers,
  Pencil,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import type { ResumeTemplateId, ResumeVersion } from "@/lib/trackerTypes";
import { RESUME_TEMPLATES } from "@/lib/resumeTemplates";
import { computeResumeHealth } from "@/lib/resumeHealth";
import { scoreTint } from "@/lib/scoreTint";
import { downloadResumeAsPdf } from "@/lib/pdfExport";
import Modal from "./Modal";

// Both only ever render inside a Modal that opens on click — code-split so
// their weight (and pdfExport's dynamically-imported jsPDF) never loads
// just from a version card existing on the page.
const ResumePdfPreview = dynamic(() => import("./ResumePdfPreview"));
const ResumeSectionEditor = dynamic(() => import("./ResumeSectionEditor"));

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function ScoreBadge({ label, score }: { label: string; score: number }) {
  const tint = scoreTint(score);
  return (
    <span className="badge" style={{ backgroundColor: tint.bg, color: tint.text }}>
      {label} {score}
    </span>
  );
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

/** One compact card per resume version — the whole point of the workspace
 * redesign is that this stays small; the large PDF preview and the
 * section editor only ever open in a Modal on demand, never inline. */
export default function ResumeVersionCard({
  version,
  atsScore,
  onRename,
  onDuplicate,
  onDelete,
  onRestore,
  onTemplateChange,
  onSaveEditedContent,
}: {
  version: ResumeVersion;
  atsScore: number | null;
  onRename: (label: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRestore: () => void;
  onTemplateChange: (templateId: ResumeTemplateId) => void;
  onSaveEditedContent: (content: string) => void;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftLabel, setDraftLabel] = useState(version.label);
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const health = computeResumeHealth(version.content);

  function handleCopy() {
    navigator.clipboard
      .writeText(version.content)
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
    if (trimmed && trimmed !== version.label) onRename(trimmed);
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
                    setDraftLabel(version.label);
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
                  setDraftLabel(version.label);
                  setIsRenaming(false);
                }}
                label="Cancel rename"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </IconButton>
            </div>
          ) : (
            <p className="truncate text-sm font-semibold text-foreground">
              {version.isMaster ? "⭐ " : `v${version.versionNumber} · `}
              {version.label}
            </p>
          )}
          {!version.isMaster && (version.companyName || version.jobRole) && (
            <p className="truncate text-xs text-muted">
              {version.companyName}
              {version.companyName && version.jobRole ? " · " : ""}
              {version.jobRole}
            </p>
          )}
        </div>
        <span
          className="badge shrink-0"
          style={{ backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" }}
        >
          {RESUME_TEMPLATES.find((t) => t.id === version.templateId)?.name ?? "Classic ATS"}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {atsScore !== null && <ScoreBadge label="ATS" score={atsScore} />}
        <ScoreBadge label="Health" score={health.score} />
      </div>

      <p className="text-[11px] text-muted">
        Created {formatDate(version.createdAt)} · Modified {formatDate(version.lastModifiedAt)}
      </p>

      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setPreviewOpen(true)} className="btn-secondary-sm">
          <Eye className="h-3.5 w-3.5" strokeWidth={2} />
          Preview
        </button>
        <button onClick={() => setEditorOpen(true)} className="btn-secondary-sm">
          <Layers className="h-3.5 w-3.5" strokeWidth={2} />
          Edit Sections
        </button>
        <button
          onClick={() => downloadResumeAsPdf(version.content, version.label, version.templateId)}
          className="btn-secondary-sm"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={2} />
          PDF
        </button>
      </div>

      <div className="flex items-center gap-1 border-t border-border pt-2">
        <IconButton onClick={handleCopy} label="Copy text to clipboard">
          <Clipboard className="h-3.5 w-3.5" strokeWidth={2} style={copied ? { color: "var(--cat-offer)" } : undefined} />
        </IconButton>
        {!version.isMaster && (
          <>
            <IconButton onClick={() => setIsRenaming(true)} label="Rename version">
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            </IconButton>
            <IconButton onClick={onDuplicate} label="Duplicate version">
              <Files className="h-3.5 w-3.5" strokeWidth={2} />
            </IconButton>
            <IconButton onClick={onRestore} label="Set as active resume">
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
            </IconButton>
            <IconButton onClick={onDelete} label="Delete version">
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
            </IconButton>
          </>
        )}
      </div>

      {previewOpen && (
        <Modal onClose={() => setPreviewOpen(false)} title={`Preview — ${version.label}`}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted">Template:</span>
            {RESUME_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => onTemplateChange(t.id)}
                title={t.description}
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
                style={
                  version.templateId === t.id
                    ? { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" }
                    : { color: "var(--muted)", border: "1px solid var(--border)" }
                }
              >
                {t.name}
              </button>
            ))}
          </div>
          <ResumePdfPreview content={version.content} templateId={version.templateId} />
          <button
            onClick={() => downloadResumeAsPdf(version.content, version.label, version.templateId)}
            className="btn-primary mt-3"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2} />
            Download as PDF
          </button>
        </Modal>
      )}

      {editorOpen && (
        <Modal onClose={() => setEditorOpen(false)} title={`Edit Sections — ${version.label}`}>
          <ResumeSectionEditor
            content={version.content}
            onSave={(newContent) => {
              onSaveEditedContent(newContent);
              setEditorOpen(false);
            }}
            onCancel={() => setEditorOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
