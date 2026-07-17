import type { Metadata } from "next";
import TrackerHeader from "@/components/TrackerHeader";
import PreparationOverview from "@/components/PreparationOverview";
import PreparationMonthView from "@/components/PreparationMonthView";
import TopicTracker from "@/components/TopicTracker";
import MonthlyRoadmap from "@/components/MonthlyRoadmap";

export const metadata: Metadata = {
  title: "Preparation Tracker — JobHunter Pro",
};

export default function PreparationPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <TrackerHeader />

      <h1 className="text-2xl font-semibold tracking-tight">Preparation Tracker</h1>
      <p className="mt-1 text-sm text-muted">
        Everything to study and practice for software engineering placements,
        tracked by topic and by month.
      </p>

      <div className="mt-8">
        <PreparationOverview />
      </div>

      <div className="mt-12">
        <PreparationMonthView />
      </div>

      <div className="mt-12">
        <MonthlyRoadmap />
      </div>

      <div className="mt-12">
        <TopicTracker />
      </div>
    </div>
  );
}
