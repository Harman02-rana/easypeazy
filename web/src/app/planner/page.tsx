import type { Metadata } from "next";
import TrackerHeader from "@/components/TrackerHeader";
import TaskList from "@/components/TaskList";
import MonthlyGoals from "@/components/MonthlyGoals";
import PlannerEntriesSection from "@/components/PlannerEntriesSection";

export const metadata: Metadata = {
  title: "My Planner — JobHunter Pro",
};

export default function PlannerPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <TrackerHeader />

      <h1 className="text-2xl font-semibold tracking-tight">My Planner</h1>
      <p className="mt-1 text-sm text-muted">
        A personal space to plan, reflect, and keep track of what matters this
        week and this month.
      </p>

      <div className="mt-10">
        <TaskList />
      </div>

      <div className="mt-12">
        <MonthlyGoals />
      </div>

      <div className="mt-12">
        <PlannerEntriesSection />
      </div>
    </div>
  );
}
