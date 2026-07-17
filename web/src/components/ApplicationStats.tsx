import { computeApplicationStats } from "@/lib/applicationUtils";
import type { Application } from "@/lib/trackerTypes";

export default function ApplicationStats({
  applications,
}: {
  applications: Application[];
}) {
  const stats = computeApplicationStats(applications);

  const cells: { label: string; value: string | number }[] = [
    { label: "Total Saved", value: stats.totalSaved },
    { label: "Total Applied", value: stats.totalApplied },
    { label: "OAs", value: stats.oas },
    { label: "Interviews", value: stats.interviews },
    { label: "Offers", value: stats.offers },
    { label: "Rejected", value: stats.rejected },
    {
      label: "Success Rate",
      value: stats.successRate === null ? "—" : `${stats.successRate}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {cells.map((c) => (
        <div key={c.label} className="rounded-lg border border-border bg-surface p-3">
          <p className="text-xs text-muted">{c.label}</p>
          <p className="mt-1 text-xl font-semibold">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
