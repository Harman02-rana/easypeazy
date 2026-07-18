"use client";

import { useState } from "react";
import {
  Check,
  Clipboard,
  Download,
  Files,
  Pencil,
  RotateCcw,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ResumeTemplateId, ResumeVersion } from "@/lib/trackerTypes";
import { RESUME_TEMPLATES } from "@/lib/resumeTemplates";
import { downloadResumeAsPdf } from "@/lib/pdfExport";
import ResumePdfPreview from "./ResumePdfPreview";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function IconButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
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

export default function ResumeVersionRow({
  version,
  isExpanded,
  onToggleExpand,
  onRename,
  onDuplicate,
  onDelete,
  onRestore,
  onTemplateChange,
}: {
  version: ResumeVersion;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRename: (label: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRestore: () => void;
  onTemplateChange: (templateId: ResumeTemplateId) => void;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftLabel, setDraftLabel] = useState(version.label);
  const [copied, setCopied] = useState(false);

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
    <div className="rounded-lg border border-border">
      <div className="row-hover flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
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
                className="rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-accent"
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
            <p className="truncate text-sm font-medium text-foreground">
              {version.isMaster ? "⭐ " : `v${version.versionNumber} · `}
              {version.label}
            </p>
          )}
          <p className="text-xs text-muted">
            {!version.isMaster && (version.companyName || version.jobRole) && (
              <>
                {version.companyName}
                {version.companyName && version.jobRole ? " · " : ""}
                {version.jobRole} ·{" "}
              </>
            )}
            Created {formatDate(version.createdAt)} · Modified {formatDate(version.lastModifiedAt)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
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
              <IconButton onClick={onRestore} label="Restore as active resume">
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              </IconButton>
              <IconButton onClick={onDelete} label="Delete version">
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
              </IconButton>
            </>
          )}
          <button onClick={onToggleExpand} className="btn-secondary-sm">
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} /> : <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />}
            {isExpanded ? "Hide" : "Preview & PDF"}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 border-t border-border p-3">
          <div className="flex flex-wrap items-center gap-2">
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
            className="btn-primary"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={2} />
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}
