"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { PlannerCategory, PlannerEntry as PlannerEntryType } from "@/lib/trackerTypes";
import PlannerEntryForm, { type PlannerEntryDraft } from "./PlannerEntryForm";

const CATEGORY_TINT: Record<PlannerCategory, { text: string; bg: string }> = {
  "Daily Plan": { text: "var(--cat-planner)", bg: "var(--cat-planner-bg)" },
  "Weekly Plan": { text: "var(--cat-planner)", bg: "var(--cat-planner-bg)" },
  "Monthly Goal": { text: "var(--cat-planner)", bg: "var(--cat-planner-bg)" },
  "Weekly Review": { text: "var(--cat-offer)", bg: "var(--cat-offer-bg)" },
  "Monthly Review": { text: "var(--cat-offer)", bg: "var(--cat-offer-bg)" },
  Learning: { text: "var(--cat-study)", bg: "var(--cat-study-bg)" },
  "Interview Notes": { text: "var(--cat-interview)", bg: "var(--cat-interview-bg)" },
  "Career Goal": { text: "var(--cat-applications)", bg: "var(--cat-applications-bg)" },
  Important: { text: "var(--cat-applications)", bg: "var(--cat-applications-bg)" },
  "Personal Note": { text: "var(--cat-sister)", bg: "var(--cat-sister-bg)" },
};

export default function PlannerEntry({
  entry,
  onUpdate,
  onDelete,
}: {
  entry: PlannerEntryType;
  onUpdate: (draft: PlannerEntryDraft) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <PlannerEntryForm
        entry={entry}
        onSave={(draft) => {
          onUpdate(draft);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  const dateObj = new Date(entry.date + "T00:00:00");
  const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = dateObj.getDate();
  const tint = CATEGORY_TINT[entry.category];

  return (
    <div className="flex gap-4 border-b border-border py-4 last:border-b-0">
      <div
        className="flex w-12 shrink-0 flex-col items-center justify-center rounded-lg py-1.5"
        style={{ backgroundColor: tint.bg, color: tint.text }}
      >
        <span className="text-[10px] font-semibold tracking-wide">{month}</span>
        <span className="text-lg font-semibold leading-none">{day}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-semibold text-foreground">{entry.title}</h3>
              <span className="badge" style={{ backgroundColor: tint.bg, color: tint.text }}>
                {entry.category}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              onClick={() => setEditing(true)}
              aria-label="Edit entry"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <button
              onClick={onDelete}
              aria-label="Delete entry"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {entry.content && (
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {entry.content}
          </p>
        )}

        {entry.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span key={tag} className="text-xs text-muted">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
