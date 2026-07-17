import type { Metadata } from "next";
import { NotebookPen } from "lucide-react";
import TrackerHeader from "@/components/TrackerHeader";
import PageHeader from "@/components/PageHeader";
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

      <PageHeader
        icon={NotebookPen}
        eyebrow="Planner"
        title="My Planner"
        description="Your own little notebook — plans, reflections, and the small stuff worth remembering."
        tint="var(--cat-planner)"
        tintBg="var(--cat-planner-bg)"
      />

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
