import type { Job } from "@/lib/types";
import JobCard from "./JobCard";
import EmptyState from "./EmptyState";

export default function JobList({ jobs }: { jobs: Job[] }) {
  if (jobs.length === 0) {
    return (
      <EmptyState
        title="No roles match your filters"
        description="Try clearing a filter or searching a different term."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
