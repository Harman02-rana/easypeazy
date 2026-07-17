import type { Metadata } from "next";
import TrackerHeader from "@/components/TrackerHeader";
import ApplicationsPageContent from "@/components/ApplicationsPageContent";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `Application Tracker — ${SITE_NAME}`,
};

export default function ApplicationsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <TrackerHeader />

      <h1 className="text-2xl font-semibold tracking-tight">My Applications</h1>
      <p className="mt-1 text-sm text-muted">
        Every application, from saved to offer, in one place.
      </p>

      <ApplicationsPageContent />
    </div>
  );
}
