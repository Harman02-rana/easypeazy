"use client";

import { useMemo, useState } from "react";
import { useMonthlyGoals } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import {
  GOAL_CATEGORIES,
  ROADMAP_MONTHS,
  currentMonthKey,
  formatMonth,
} from "@/lib/trackerTypes";
import type { GoalCategory } from "@/lib/trackerTypes";
import ProgressBar from "./ProgressBar";
import EmptyState from "./EmptyState";

export default function MonthlyGoals() {
  const { items, hydrated, add, update, remove } = useMonthlyGoals();
  const [month, setMonth] = useState(currentMonthKey());
  const [creating, setCreating] = useState(false);
  const [goal, setGoal] = useState("");
  const [category, setCategory] = useState<GoalCategory>("Study");
  const [target, setTarget] = useState("");

  const monthGoals = useMemo(
    () => items.filter((g) => g.month === month),
    [items, month]
  );

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">Monthly goals</h2>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground outline-none focus:border-accent"
        >
          {ROADMAP_MONTHS.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </select>
      </div>

      {!creating ? (
        <button
          onClick={() => setCreating(true)}
          className="btn-tactile mt-3 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
        >
          Add goal for {formatMonth(month)}
        </button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!goal.trim()) return;
            add({
              id: generateId(),
              month,
              goal: goal.trim(),
              category,
              target: target.trim(),
              progress: 0,
              notes: "",
            });
            setGoal("");
            setTarget("");
            setCreating(false);
          }}
          className="card-soft mt-3 space-y-3 p-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-muted">
              Goal
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Finish arrays + strings"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                autoFocus
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-muted">
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              >
                {GOAL_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs text-muted">
            Target
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. 50 problems, 1st draft resume..."
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              className="btn-tactile rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
            >
              Add goal
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-4">
        {!hydrated ? null : monthGoals.length === 0 ? (
          <EmptyState
            title={`${formatMonth(month)} is a fresh page`}
            description="Add a goal above whenever you're ready to give the month some direction."
          />
        ) : (
          <div className="space-y-3">
            {monthGoals.map((g) => (
              <div
                key={g.id}
                className="card-soft p-4"
                style={{ backgroundColor: "var(--cat-planner-bg)" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{g.goal}</p>
                      <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted">
                        {g.category}
                      </span>
                    </div>
                    {g.target && (
                      <p className="mt-0.5 text-xs text-muted">Target: {g.target}</p>
                    )}
                  </div>
                  <button
                    onClick={() => remove(g.id)}
                    className="text-xs text-muted transition-colors hover:text-foreground cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar value={g.progress} />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={g.progress}
                    onChange={(e) =>
                      update(g.id, { progress: Number(e.target.value) })
                    }
                    className="w-24 cursor-pointer accent-accent"
                  />
                  <span className="w-9 shrink-0 text-right text-xs text-muted">
                    {g.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
