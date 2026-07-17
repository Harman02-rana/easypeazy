import type { Metadata } from "next";
import TrackerHeader from "@/components/TrackerHeader";
import TaskList from "@/components/TaskList";
import MonthlyGoals from "@/components/MonthlyGoals";
import LittleWins from "@/components/LittleWins";
import PlannerEntriesSection from "@/components/PlannerEntriesSection";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `My Planner — ${SITE_NAME}`,
};

export default function PlannerPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <TrackerHeader />

      <h1 className="text-2xl font-semibold tracking-tight">My Planner</h1>
      <p className="mt-1 text-sm text-muted">
        Your own little notebook — plans, reflections, and the small stuff
        worth remembering.
      </p>

      <div className="mt-10">
        <TaskList />
      </div>

      <div className="mt-12">
        <MonthlyGoals />
      </div>

      <div className="mt-12">
        <LittleWins />
      </div>

      <div className="mt-12">
        <PlannerEntriesSection />
      </div>
    </div>
  );
}
