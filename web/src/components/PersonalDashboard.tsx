"use client";

import Link from "next/link";
import {
  Award,
  BriefcaseBusiness,
  CalendarClock,
  ClipboardCheck,
  GraduationCap,
  ListChecks,
  Users,
} from "lucide-react";
import { useApplications, useMonthlyGoals, useStudyTopics, useTasks } from "@/hooks/useTracker";
import { computeApplicationStats, computeUpcomingEvents } from "@/lib/applicationUtils";
import { computeHeadlineProgress } from "@/lib/prepUtils";
import { currentMonthKey, formatMonth } from "@/lib/trackerTypes";
import type { Job } from "@/lib/types";
import EmptyState from "./EmptyState";
import MotivationCorner from "./MotivationCorner";
import ProgressBar from "./ProgressBar";
import StatCard from "./StatCard";
import JobList from "./JobList";

export default function PersonalDashboard({ recentJobs = [] }: { recentJobs?: Job[] }) {
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
  const upcoming = computeUpcomingEvents(applications).slice(0, 5);

  const noDataAtAll =
    topics.every((t) => t.progress === 0) &&
    applications.length === 0 &&
    tasks.length === 0 &&
    monthGoals.length === 0;

  const stats = [
    {
      label: "Study Progress",
      value: `${studyProgress}%`,
      href: "/preparation",
      icon: GraduationCap,
      text: "var(--cat-study)",
      bg: "var(--cat-study-bg)",
    },
    {
      label: "Applications Sent",
      value: appStats.totalApplied,
      href: "/applications",
      icon: BriefcaseBusiness,
      text: "var(--cat-applications)",
      bg: "var(--cat-applications-bg)",
    },
    {
      label: "OAs",
      value: appStats.oas,
      href: "/applications",
      icon: ClipboardCheck,
      text: "var(--cat-study)",
      bg: "var(--cat-study-bg)",
    },
    {
      label: "Interviews",
      value: appStats.interviews,
      href: "/applications",
      icon: Users,
      text: "var(--cat-interview)",
      bg: "var(--cat-interview-bg)",
    },
    {
      label: "Offers 🎉",
      value: appStats.offers,
      href: "/applications",
      icon: Award,
      text: "var(--cat-offer)",
      bg: "var(--cat-offer-bg)",
    },
    {
      label: "Tasks This Month",
      value: `${tasksDone}/${tasksThisMonth.length}`,
      href: "/planner",
      icon: ListChecks,
      text: "var(--cat-planner)",
      bg: "var(--cat-planner-bg)",
    },
  ];

  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <h2 className="text-sm font-semibold text-muted">Your progress</h2>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {noDataAtAll ? (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EmptyState
                title="Nothing tracked yet — and that's okay 🌱"
                description="Save a job, log a study topic, or add a task, and your progress will start showing up here."
              />
            </div>
            <MotivationCorner />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div>
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <CalendarClock className="h-4 w-4 text-muted" strokeWidth={2} />
                  Your next steps
                </h3>
                {upcoming.length === 0 ? (
                  <div className="mt-2">
                    <EmptyState
                      title="Nothing on the calendar right now"
                      description="Enjoy the breathing room — deadlines, OAs, and interviews will show up here."
                    />
                  </div>
                ) : (
                  <div className="list-soft mt-2">
                    {upcoming.map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-foreground">
                            {e.company} <span className="text-muted">· {e.type}</span>
                          </p>
                          <p className="mt-0.5 text-xs text-muted">{e.role}</p>
                        </div>
                        <span className="shrink-0 text-xs font-medium text-muted">{e.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {recentJobs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <BriefcaseBusiness className="h-4 w-4 text-muted" strokeWidth={2} />
                      Recent opportunities
                    </h3>
                    <Link
                      href="/jobs"
                      className="text-xs font-medium text-muted transition-colors hover:text-foreground"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="mt-2">
                    <JobList jobs={recentJobs.slice(0, 5)} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="card-soft p-4">
                <p className="text-sm font-semibold text-foreground">
                  {formatMonth(month)}
                </p>
                <div className="mt-3">
                  <ProgressBar value={studyProgress} label="Study progress" showMessage />
                </div>
                {monthGoals.length === 0 ? (
                  <p className="mt-3 text-xs text-muted">
                    No goals set yet for this month — whenever you&rsquo;re ready.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                    {monthGoals.slice(0, 4).map((g) => (
                      <li key={g.id} className="text-sm text-foreground">
                        {g.goal} <span className="text-muted">· {g.progress}%</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <MotivationCorner />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
