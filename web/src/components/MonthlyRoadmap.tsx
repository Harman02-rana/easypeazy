"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useMilestones } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import { ROADMAP_MONTHS, currentMonthKey, formatMonth } from "@/lib/trackerTypes";
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
      className="card-soft space-y-3 p-4"
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
          className="btn-primary"
        >
          {milestone ? "Save changes" : "Add milestone"}
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

export default function MonthlyRoadmap() {
  const { items, hydrated, add, update, remove } = useMilestones();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const thisMonth = currentMonthKey();

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">
          Your roadmap, month by month
        </h2>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="btn-primary-sm"
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
            title="Your roadmap is a blank page right now"
            description="Add a milestone for each month — it can always change later."
          />
        ) : (
          <div className="space-y-0 border-l-2 border-border pl-6">
            {ROADMAP_MONTHS.map((month) => {
              const monthMilestones = items.filter((m) => m.month === month);
              if (monthMilestones.length === 0) return null;
              const allDone = monthMilestones.every((m) => m.completed);
              const isCurrent = month === thisMonth && !allDone;
              const markerColor = allDone
                ? "var(--cat-offer)"
                : isCurrent
                  ? "var(--accent)"
                  : "var(--border-strong)";
              return (
                <div key={month} className="relative pb-6 last:pb-0">
                  <span
                    className="absolute top-1 left-[-1.65rem] h-3 w-3 rounded-full border-2"
                    style={{
                      borderColor: markerColor,
                      backgroundColor: allDone || isCurrent ? markerColor : "var(--surface)",
                    }}
                  />
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted">
                    {formatMonth(month)}
                    {isCurrent && (
                      <span className="pill" style={{ backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" }}>
                        Now
                      </span>
                    )}
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
                        <div key={m.id} className="card-soft flex items-start gap-3 p-3">
                          <input
                            type="checkbox"
                            checked={m.completed}
                            onChange={(e) =>
                              update(m.id, { completed: e.target.checked })
                            }
                            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p
                                className={`font-medium ${
                                  m.completed ? "text-muted line-through" : "text-foreground"
                                }`}
                              >
                                {m.title}
                              </p>
                              {m.completed && (
                                <span
                                  className="pill sparkle-pop"
                                  style={{
                                    backgroundColor: "var(--cat-offer-bg)",
                                    color: "var(--cat-offer)",
                                  }}
                                >
                                  Nice work! ✨
                                </span>
                              )}
                            </div>
                            {m.description && (
                              <p className="mt-0.5 text-sm text-muted">
                                {m.description}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <button
                              onClick={() => setEditingId(m.id)}
                              aria-label="Edit milestone"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => remove(m.id)}
                              aria-label="Delete milestone"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
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
