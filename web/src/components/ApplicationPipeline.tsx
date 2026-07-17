import { PIPELINE_STATUSES } from "@/lib/trackerTypes";
import type { Application } from "@/lib/trackerTypes";

export default function ApplicationPipeline({
  applications,
}: {
  applications: Application[];
}) {
  const counts = PIPELINE_STATUSES.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }));
  const rejected = applications.filter((a) => a.status === "Rejected").length;
  const withdrawn = applications.filter((a) => a.status === "Withdrawn").length;

  return (
    <section>
      <h2 className="text-base font-semibold tracking-tight">Pipeline</h2>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        {counts.map((c, i) => (
          <div key={c.status} className="flex flex-1 items-center gap-2">
            <div className="flex-1 rounded-lg border border-border bg-surface p-3 text-center">
              <p className="text-xs text-muted">{c.status}</p>
              <p className="mt-1 text-xl font-semibold">{c.count}</p>
            </div>
            {i < counts.length - 1 && (
              <span className="hidden text-muted sm:inline">→</span>
            )}
          </div>
        ))}
      </div>

      {(rejected > 0 || withdrawn > 0) && (
        <div className="mt-3 flex gap-3 text-sm text-muted">
          {rejected > 0 && <span>{rejected} rejected</span>}
          {withdrawn > 0 && <span>{withdrawn} withdrawn</span>}
        </div>
      )}
    </section>
  );
}
