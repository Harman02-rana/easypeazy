"use client";

import { useApplications } from "@/hooks/useTracker";
import type { Job } from "@/lib/types";

export default function SaveToTrackerButton({ job }: { job: Job }) {
  const { hydrated, isSaved, saveFromJob } = useApplications();

  if (!hydrated) return null;

  const saved = isSaved(job.company, job.position, job.applyLink);

  return (
    <button
      onClick={() => {
        if (saved) return;
        saveFromJob({
          company: job.company,
          role: job.position,
          jobType: job.type,
          location: job.location,
          applicationLink: job.applyLink,
        });
      }}
      disabled={saved}
      className={`btn-tactile rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
        saved
          ? "border-border text-muted"
          : "border-border text-foreground hover:border-border-strong hover:bg-surface-hover cursor-pointer"
      }`}
    >
      {saved ? "Saved ✓" : "Save to Tracker"}
    </button>
  );
}
