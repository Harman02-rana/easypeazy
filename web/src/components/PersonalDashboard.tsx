"use client";

import Link from "next/link";
import { useApplications, useMonthlyGoals, useStudyTopics, useTasks } from "@/hooks/useTracker";
import { computeApplicationStats, computeUpcomingEvents } from "@/lib/applicationUtils";
import { computeHeadlineProgress } from "@/lib/prepUtils";
import { currentMonthKey, formatMonth } from "@/lib/trackerTypes";
import EmptyState from "./EmptyState";
import MotivationCorner from "./MotivationCorner";

export default function PersonalDashboard() {
  const { items: topics, hydrated: topicsHydrated } = useStudyTopics();
  const { items: applications, hydrated: appsHydrated } = useApplications();
  const { items: tasks, hydrated: tasksHydrated } = useTasks();
  const { items: goals, hydrated: goalsHydrated } = useMonthlyGoals();

  const hydrated = topicsHydrated && appsHydrated && tasksHydrated && goalsHydrated;
  if (!hydrated) return null;

  const month = currentMonthKey();
  const studyProgress = computeHeadlineProgress(topics).overall;
  const appStats = computeApplicationStats(applications);

  const now = new Date().toISOString().slice(0, 10);
  const monthStart = `${month}-01`;
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const monthEnd = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-01`;
  const tasksThisMonth = tasks.filter(
    (t) => t.dueDate && t.dueDate >= monthStart && t.dueDate < monthEnd
  );
  const tasksDone = tasksThisMonth.filter((t) => t.status === "Done").length;

  const monthGoals = goals.filter((g) => g.month === month);
  const upcoming = computeUpcomingEvents(applications).slice(0, 4);

  const noDataAtAll =
    topics.every((t) => t.progress === 0) &&
    applications.length === 0 &&
    tasks.length === 0 &&
    monthGoals.length === 0;

  const stats = [
    { label: "Study Progress", value: `${studyProgress}%`, href: "/preparation" },
    { label: "Applications Sent", value: appStats.totalApplied, href: "/applications" },
    { label: "OAs", value: appStats.oas, href: "/applications" },
    { label: "Interviews", value: appStats.interviews, href: "/applications" },
    { label: "Offers", value: appStats.offers, href: "/applications" },
    {
      label: "Tasks This Month",
      value: `${tasksDone}/${tasksThisMonth.length}`,
      href: "/planner",
    },
  ];

  return (
    <section className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <h2 className="text-sm font-semibold text-muted">Your progress</h2>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="row-hover rounded-lg border border-border bg-background p-3"
            >
              <p className="text-xs text-muted">{s.label}</p>
              <p className="mt-1 text-lg font-semibold">{s.value}</p>
            </Link>
          ))}
        </div>

        {noDataAtAll ? (
          <div className="mt-4">
            <EmptyState
              title="Nothing tracked yet"
              description="Save a job, log a study topic, or add a task to see your progress here."
            />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-semibold">
                {formatMonth(month)} goals
              </p>
              {monthGoals.length === 0 ? (
                <p className="mt-1 text-sm text-muted">
                  No goals set for this month yet.
                </p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {monthGoals.slice(0, 4).map((g) => (
                    <li key={g.id} className="text-sm text-foreground">
                      {g.goal} <span className="text-muted">· {g.progress}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm font-semibold">Upcoming</p>
              {upcoming.length === 0 ? (
                <p className="mt-1 text-sm text-muted">
                  No upcoming deadlines, OAs, or interviews.
                </p>
              ) : (
                <ul className="mt-2 space-y-1">
                  {upcoming.map((e) => (
                    <li key={e.id} className="text-sm text-foreground">
                      {e.company} · {e.type}{" "}
                      <span className="text-muted">· {e.date}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="mt-4">
          <MotivationCorner />
        </div>
      </div>
    </section>
  );
}
