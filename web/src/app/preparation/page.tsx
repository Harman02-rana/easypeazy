import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import TrackerHeader from "@/components/TrackerHeader";
import PageHeader from "@/components/PageHeader";
import PreparationOverview from "@/components/PreparationOverview";
import CurrentFocus from "@/components/CurrentFocus";
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

      <PageHeader
        icon={GraduationCap}
        eyebrow="Preparation"
        title="Your Learning Journey"
        description="Everything you're studying and practicing, one topic and one month at a time. Progress here counts, even the slow days."
        tint="var(--cat-study)"
        tintBg="var(--cat-study-bg)"
      />

      <div className="mt-8">
        <PreparationOverview />
      </div>

      <div className="mt-12">
        <CurrentFocus />
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
