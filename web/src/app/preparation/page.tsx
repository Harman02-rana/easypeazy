import type { Metadata } from "next";
import TrackerHeader from "@/components/TrackerHeader";
import PreparationOverview from "@/components/PreparationOverview";
import PreparationMonthView from "@/components/PreparationMonthView";
import TopicTracker from "@/components/TopicTracker";
import MonthlyRoadmap from "@/components/MonthlyRoadmap";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `Preparation Tracker — ${SITE_NAME}`,
};

export default function PreparationPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <TrackerHeader />

      <h1 className="text-2xl font-semibold tracking-tight">Your Learning Journey</h1>
      <p className="mt-1 text-sm text-muted">
        Everything you&rsquo;re studying and practicing, one topic and one month
        at a time. Progress here counts, even the slow days.
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
