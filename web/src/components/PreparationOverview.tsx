"use client";

import {
  Calculator,
  Code2,
  Cpu,
  FolderGit2,
  MessagesSquare,
  Target,
} from "lucide-react";
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

  const stats = [
    { label: "Overall", value: headline.overall, icon: Target },
    { label: "DSA", value: headline.dsa, icon: Code2 },
    { label: "Core CS", value: headline.coreCs, icon: Cpu },
    { label: "Aptitude", value: headline.aptitude, icon: Calculator },
    { label: "Interview Prep", value: headline.interviewPrep, icon: MessagesSquare },
    { label: "Projects", value: headline.projects, icon: FolderGit2 },
  ];

  return (
    <section>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="card-soft p-3.5">
            <div className="flex items-center justify-between">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: "var(--cat-study-bg)", color: "var(--cat-study)" }}
              >
                <s.icon className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span className="text-lg font-semibold text-foreground">{s.value}%</span>
            </div>
            <p className="mt-2 text-xs text-muted">{s.label}</p>
            <div className="mt-2">
              <ProgressBar value={s.value} />
            </div>
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
