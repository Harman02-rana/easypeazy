import { PIPELINE_STATUSES } from "@/lib/trackerTypes";
import type { Application } from "@/lib/trackerTypes";
import { statusColors, statusLabel } from "@/lib/statusDisplay";

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
        {counts.map((c, i) => {
          const colors = statusColors(c.status);
          return (
            <div key={c.status} className="flex flex-1 items-center gap-2">
              <div
                className="card-soft flex-1 p-3 text-center"
                style={{ backgroundColor: colors.bg }}
              >
                <p className="text-xs text-muted">{c.status}</p>
                <p className="mt-1 text-xl font-semibold" style={{ color: colors.text }}>
                  {c.count}
                </p>
              </div>
              {i < counts.length - 1 && (
                <span className="hidden text-muted sm:inline">→</span>
              )}
            </div>
          );
        })}
      </div>

      {(rejected > 0 || withdrawn > 0) && (
        <div className="mt-3 flex gap-3 text-sm">
          {rejected > 0 && (
            <span style={{ color: "var(--cat-rejected)" }}>
              {rejected} {statusLabel("Rejected").toLowerCase()}
            </span>
          )}
          {withdrawn > 0 && <span className="text-muted">{withdrawn} withdrawn</span>}
        </div>
      )}
    </section>
  );
}
