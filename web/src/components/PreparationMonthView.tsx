"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useMilestones, useMonthlyGoals, useStudyTopics } from "@/hooks/useTracker";
import { averageProgress } from "@/lib/prepUtils";
import { ROADMAP_MONTHS, currentMonthKey, formatMonth } from "@/lib/trackerTypes";
import ProgressBar from "./ProgressBar";
import EmptyState from "./EmptyState";

export default function PreparationMonthView() {
  const { items: topics, hydrated: topicsHydrated } = useStudyTopics();
  const { items: goals, hydrated: goalsHydrated } = useMonthlyGoals();
  const { items: milestones, hydrated: milestonesHydrated } = useMilestones();
  const [month, setMonth] = useState(currentMonthKey());

  const hydrated = topicsHydrated && goalsHydrated && milestonesHydrated;
  if (!hydrated) return null;

  const monthTopics = topics.filter((t) => t.targetMonth === month);
  const completedTopics = monthTopics.filter((t) => t.status === "Completed");
  const questionsSolvedThisMonth = monthTopics.reduce(
    (acc, t) => acc + t.questionsCompleted,
    0
  );
  const monthGoals = goals.filter((g) => g.month === month);
  const monthMilestones = milestones.filter((m) => m.month === month);
  const progress = averageProgress(monthTopics);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">Month view</h2>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent-soft-bg"
        >
          {ROADMAP_MONTHS.map((m) => (
            <option key={m} value={m}>
              {formatMonth(m)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card-soft p-3">
          <p className="text-xs text-muted">Topics planned</p>
          <p className="mt-1 text-lg font-semibold">{monthTopics.length}</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-xs text-muted">Topics completed</p>
          <p className="mt-1 text-lg font-semibold">{completedTopics.length}</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-xs text-muted">Questions solved</p>
          <p className="mt-1 text-lg font-semibold">{questionsSolvedThisMonth}</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-xs text-muted">Progress</p>
          <div className="mt-2">
            <ProgressBar value={progress} />
          </div>
        </div>
      </div>

      {monthMilestones.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-muted">Milestones</h3>
          <ul className="mt-1.5 space-y-1.5">
            {monthMilestones.map((m) => (
              <li key={m.id} className="flex items-center gap-1.5 text-sm text-foreground">
                {m.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--cat-offer)" }} strokeWidth={2} />
                ) : (
                  <Circle className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={2} />
                )}
                {m.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {monthGoals.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-muted">Goals</h3>
          <ul className="mt-1.5 space-y-1">
            {monthGoals.map((g) => (
              <li key={g.id} className="text-sm text-foreground">
                {g.goal}{" "}
                <span className="text-muted">
                  · {g.progress}% {g.notes && `· ${g.notes}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {monthTopics.length === 0 && monthGoals.length === 0 && monthMilestones.length === 0 && (
        <div className="mt-4">
          <EmptyState
            title={`${formatMonth(month)} is wide open right now`}
            description="Set a target month on a topic or add a goal, and it'll show up here."
          />
        </div>
      )}
    </section>
  );
}
