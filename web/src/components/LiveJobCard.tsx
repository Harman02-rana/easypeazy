"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import CompanyAvatar from "./CompanyAvatar";
import { useApplications } from "@/hooks/useTracker";
import type { NormalizedJob } from "@/lib/jobSources/types";
import type { ApplicationJobType } from "@/lib/trackerTypes";

function jobTypeFor(job: NormalizedJob): ApplicationJobType {
  if (job.employmentType === "Internship") return "Internship";
  if (job.employmentType === "Full-Time") return "New Grad";
  return "Other";
}

export default function LiveJobCard({ job }: { job: NormalizedJob }) {
  const { hydrated, isSaved, saveFromJob } = useApplications();
  const saved = hydrated && isSaved(job.company, job.role, job.applyLink);

  return (
    <div className="row-hover flex flex-col gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <CompanyAvatar name={job.company} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">{job.company}</span>
            {job.employmentType !== "Unknown" && (
              <span
                className="badge"
                style={{
                  backgroundColor:
                    job.employmentType === "Internship" ? "var(--cat-study-bg)" : "var(--cat-applications-bg)",
                  color: job.employmentType === "Internship" ? "var(--cat-study)" : "var(--cat-applications)",
                }}
              >
                {job.employmentType}
              </span>
            )}
            {job.batchEligibility && (
              <span className="badge border border-border text-muted">{job.batchEligibility}</span>
            )}
            <span className="badge border border-border text-muted">{job.source}</span>
          </div>
          <p className="mt-0.5 truncate text-sm text-foreground/90">{job.role}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3 w-3 shrink-0" strokeWidth={2} />
            {job.location}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {hydrated && (
          <button
            onClick={() =>
              saveFromJob({
                company: job.company,
                role: job.role,
                jobType: jobTypeFor(job),
                location: job.location,
                applicationLink: job.applyLink,
              })
            }
            disabled={saved}
            className={`btn-tactile rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              saved
                ? "border-border text-muted"
                : "border-border text-foreground hover:border-border-strong hover:bg-surface-hover cursor-pointer"
            }`}
          >
            {saved ? "Saved ✓" : "Save to Tracker"}
          </button>
        )}
        <a
          href={job.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary-sm"
        >
          Apply
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
        </a>
      </div>
    </div>
  );
}
