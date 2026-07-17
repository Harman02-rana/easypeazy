import Link from "next/link";
import type { Job } from "@/lib/types";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="row-hover flex flex-col gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-foreground">{job.company}</span>
          <span
            className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ${
              job.type === "Internship"
                ? "bg-surface-hover text-muted"
                : "border border-border text-muted"
            }`}
          >
            {job.type}
          </span>
          {job.category && (
            <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted">
              {job.category.split(",")[0].trim()}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-foreground/90">{job.position}</p>
        <p className="mt-0.5 text-xs text-muted">
          {job.location || "Location not specified"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`/companies/${job.companySlug}`}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface-hover"
        >
          View details
        </Link>
        {job.applyLink && (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Apply
          </a>
        )}
      </div>
    </div>
  );
}
