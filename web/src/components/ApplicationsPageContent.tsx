"use client";

import { useApplications } from "@/hooks/useTracker";
import ApplicationStats from "./ApplicationStats";
import ApplicationPipeline from "./ApplicationPipeline";
import UpcomingEvents from "./UpcomingEvents";
import ApplicationTable from "./ApplicationTable";

export default function ApplicationsPageContent() {
  const { items, hydrated } = useApplications();

  if (!hydrated) return null;

  return (
    <>
      <div className="mt-8">
        <ApplicationStats applications={items} />
      </div>

      <div className="mt-12">
        <ApplicationPipeline applications={items} />
      </div>

      <div className="mt-12">
        <UpcomingEvents applications={items} />
      </div>

      <div className="mt-12">
        <ApplicationTable />
      </div>
    </>
  );
}
