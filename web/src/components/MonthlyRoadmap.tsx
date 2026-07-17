"use client";

import { useState } from "react";
import { useMilestones } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import { ROADMAP_MONTHS, formatMonth } from "@/lib/trackerTypes";
import type { RoadmapMilestone } from "@/lib/trackerTypes";
import EmptyState from "./EmptyState";

interface MilestoneDraft {
  month: string;
  title: string;
  description: string;
}

function MilestoneForm({
  milestone,
  defaultMonth,
  onSave,
  onCancel,
}: {
  milestone?: RoadmapMilestone;
  defaultMonth: string;
  onSave: (draft: MilestoneDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<MilestoneDraft>({
    month: milestone?.month ?? defaultMonth,
    title: milestone?.title ?? "",
    description: milestone?.description ?? "",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.title.trim()) return;
        onSave(draft);
      }}
      className="space-y-3 rounded-lg border border-border bg-surface p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Month
          <select
            value={draft.month}
            onChange={(e) => setDraft({ ...draft, month: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            {ROADMAP_MONTHS.map((m) => (
              <option key={m} value={m}>
                {formatMonth(m)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Title
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            autoFocus
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-xs text-muted">
        Description
        <textarea
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          rows={2}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
        >
          {milestone ? "Save changes" : "Add milestone"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function MonthlyRoadmap() {
  const { items, hydrated, add, update, remove } = useMilestones();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">
          Month-by-month roadmap
        </h2>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            Add milestone
          </button>
        )}
      </div>

      {creating && (
        <div className="mt-3">
          <MilestoneForm
            defaultMonth={ROADMAP_MONTHS[0]}
            onSave={(draft) => {
              add({ id: generateId(), ...draft, completed: false });
              setCreating(false);
            }}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      <div className="mt-4">
        {!hydrated ? null : items.length === 0 ? (
          <EmptyState
            title="No milestones yet"
            description="Add a milestone for each month to keep the roadmap honest."
          />
        ) : (
          <div className="space-y-4">
            {ROADMAP_MONTHS.map((month) => {
              const monthMilestones = items.filter((m) => m.month === month);
              if (monthMilestones.length === 0) return null;
              return (
                <div key={month}>
                  <h3 className="text-sm font-semibold text-muted">
                    {formatMonth(month)}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {monthMilestones.map((m) =>
                      editingId === m.id ? (
                        <MilestoneForm
                          key={m.id}
                          milestone={m}
                          defaultMonth={m.month}
                          onSave={(draft) => {
                            update(m.id, draft);
                            setEditingId(null);
                          }}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <div
                          key={m.id}
                          className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3"
                        >
                          <input
                            type="checkbox"
                            checked={m.completed}
                            onChange={(e) =>
                              update(m.id, { completed: e.target.checked })
                            }
                            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className={`font-medium ${
                                m.completed
                                  ? "text-muted line-through"
                                  : "text-foreground"
                              }`}
                            >
                              {m.title}
                            </p>
                            {m.description && (
                              <p className="mt-0.5 text-sm text-muted">
                                {m.description}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 gap-2 text-xs">
                            <button
                              onClick={() => setEditingId(m.id)}
                              className="rounded-lg border border-border px-2.5 py-1 font-medium transition-colors hover:bg-surface-hover cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => remove(m.id)}
                              className="rounded-lg border border-border px-2.5 py-1 font-medium text-muted transition-colors hover:bg-surface-hover cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
