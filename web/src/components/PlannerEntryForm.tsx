"use client";

import { useState } from "react";
import { PLANNER_CATEGORIES } from "@/lib/trackerTypes";
import type { PlannerCategory, PlannerEntry } from "@/lib/trackerTypes";

export interface PlannerEntryDraft {
  title: string;
  date: string;
  content: string;
  category: PlannerCategory;
  tags: string;
}

function toDraft(entry?: PlannerEntry): PlannerEntryDraft {
  if (!entry) {
    return {
      title: "",
      date: new Date().toISOString().slice(0, 10),
      content: "",
      category: "Daily Plan",
      tags: "",
    };
  }
  return {
    title: entry.title,
    date: entry.date,
    content: entry.content,
    category: entry.category,
    tags: entry.tags.join(", "),
  };
}

export default function PlannerEntryForm({
  entry,
  onSave,
  onCancel,
}: {
  entry?: PlannerEntry;
  onSave: (draft: PlannerEntryDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<PlannerEntryDraft>(toDraft(entry));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.title.trim()) return;
        onSave(draft);
      }}
      className="card-soft space-y-3 p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Title
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="What's this entry about?"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            autoFocus
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Date
          <input
            type="date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Category
          <select
            value={draft.category}
            onChange={(e) =>
              setDraft({ ...draft, category: e.target.value as PlannerCategory })
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            {PLANNER_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Tags (comma separated)
          <input
            value={draft.tags}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
            placeholder="e.g. dsa, revision"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Notes
        <textarea
          value={draft.content}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          rows={5}
          placeholder="Write freely — plans, reflections, reminders..."
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="btn-primary"
        >
          {entry ? "Save changes" : "Add entry"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
