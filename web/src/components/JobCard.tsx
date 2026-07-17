import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Job } from "@/lib/types";
import SaveToTrackerButton from "./SaveToTrackerButton";
import CompanyAvatar from "./CompanyAvatar";

export default function JobCard({ job }: { job: Job }) {
  const isInternship = job.type === "Internship";
  return (
    <div className="row-hover flex flex-col gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <CompanyAvatar name={job.company} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">{job.company}</span>
            <span
              className="badge"
              style={{
                backgroundColor: isInternship ? "var(--cat-study-bg)" : "var(--cat-applications-bg)",
                color: isInternship ? "var(--cat-study)" : "var(--cat-applications)",
              }}
            >
              {job.type}
            </span>
            {job.category && (
              <span className="badge border border-border text-muted">
                {job.category.split(",")[0].trim()}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-foreground/90">{job.position}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3 w-3 shrink-0" strokeWidth={2} />
            {job.location || "Location not specified"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Link
          href={`/companies/${job.companySlug}`}
          className="btn-secondary-sm"
        >
          View details
        </Link>
        <SaveToTrackerButton job={job} />
        {job.applyLink && (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-sm"
          >
            Apply
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
          </a>
        )}
      </div>
    </div>
  );
}
