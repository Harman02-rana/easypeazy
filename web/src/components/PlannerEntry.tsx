"use client";

import { useState } from "react";
import type { PlannerEntry as PlannerEntryType } from "@/lib/trackerTypes";
import PlannerEntryForm, { type PlannerEntryDraft } from "./PlannerEntryForm";

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

  const formattedDate = new Date(entry.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-foreground">{entry.title}</h3>
            <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted">
              {entry.category}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">{formattedDate}</p>
        </div>
        <div className="flex shrink-0 gap-2 text-xs">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg border border-border px-2.5 py-1 font-medium text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg border border-border px-2.5 py-1 font-medium text-muted transition-colors hover:bg-surface-hover cursor-pointer"
          >
            Delete
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
  );
}
