"use client";

import { useStudyTopics } from "@/hooks/useTracker";
import {
  computeHeadlineProgress,
  questionsSolved,
  topicsCompletedCount,
} from "@/lib/prepUtils";
import { currentMonthKey } from "@/lib/trackerTypes";
import ProgressBar from "./ProgressBar";

export default function PreparationOverview() {
  const { items, hydrated } = useStudyTopics();

  if (!hydrated) return null;

  const headline = computeHeadlineProgress(items);
  const completed = topicsCompletedCount(items);
  const remaining = items.length - completed;
  const solved = questionsSolved(items);

  const thisMonth = currentMonthKey();
  const thisMonthTopics = items.filter((t) => t.targetMonth === thisMonth);
  const thisMonthProgress =
    thisMonthTopics.length === 0
      ? 0
      : Math.round(
          thisMonthTopics.reduce((acc, t) => acc + t.progress, 0) /
            thisMonthTopics.length
        );

  const stats: { label: string; value: number }[] = [
    { label: "Overall", value: headline.overall },
    { label: "DSA", value: headline.dsa },
    { label: "Core CS", value: headline.coreCs },
    { label: "Aptitude", value: headline.aptitude },
    { label: "Interview Prep", value: headline.interviewPrep },
    { label: "Projects", value: headline.projects },
  ];

  return (
    <section>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card-soft p-3"
            style={{ backgroundColor: "var(--cat-study-bg)" }}
          >
            <p className="text-xs text-muted">{s.label}</p>
            <p className="mt-1 text-xl font-semibold" style={{ color: "var(--cat-study)" }}>
              {s.value}%
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card-soft p-3">
          <p className="text-xs text-muted">Questions solved</p>
          <p className="mt-1 text-lg font-semibold">{solved}</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-xs text-muted">Topics you&rsquo;ve conquered</p>
          <p className="mt-1 text-lg font-semibold">{completed}</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-xs text-muted">Up next</p>
          <p className="mt-1 text-lg font-semibold">{remaining}</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-xs text-muted">This month</p>
          <div className="mt-2">
            <ProgressBar value={thisMonthProgress} showMessage />
          </div>
        </div>
      </div>
    </section>
  );
}
