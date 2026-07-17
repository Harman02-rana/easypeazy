"use client";

import { Flame } from "lucide-react";
import { useStudyTopics } from "@/hooks/useTracker";
import ProgressBar from "./ProgressBar";
import EmptyState from "./EmptyState";

const ACTIVE_STATUSES = ["Learning", "Practicing", "Revision"];

export default function CurrentFocus() {
  const { items, hydrated } = useStudyTopics();

  if (!hydrated) return null;

  const active = items
    .filter((t) => ACTIVE_STATUSES.includes(t.status))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  return (
    <section>
      <h2 className="flex items-center gap-1.5 text-base font-semibold tracking-tight">
        <Flame className="h-4 w-4" style={{ color: "var(--cat-interview)" }} strokeWidth={2} />
        Current focus
      </h2>
      <p className="mt-0.5 text-sm text-muted">
        What you&rsquo;re actively working on right now.
      </p>

      <div className="mt-3">
        {active.length === 0 ? (
          <EmptyState
            title="Nothing in progress right now"
            description="Mark a topic as Learning or Practicing and it'll show up here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((t) => (
              <div key={t.id} className="card-soft p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{t.topic}</p>
                  <span
                    className="pill shrink-0"
                    style={{ backgroundColor: "var(--cat-study-bg)", color: "var(--cat-study)" }}
                  >
                    {t.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-muted">{t.category}</p>
                <div className="mt-2.5">
                  <ProgressBar value={t.progress} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
