import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import TrackerHeader from "@/components/TrackerHeader";
import PageHeader from "@/components/PageHeader";
import ApplicationsPageContent from "@/components/ApplicationsPageContent";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `Application Tracker — ${SITE_NAME}`,
};

export default function ApplicationsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <TrackerHeader />

      <PageHeader
        icon={ClipboardList}
        eyebrow="Applications"
        title="My Applications"
        description="Every application, from saved to offer, in one place."
        tint="var(--cat-applications)"
        tintBg="var(--cat-applications-bg)"
      />

      <ApplicationsPageContent />
    </div>
  );
}
