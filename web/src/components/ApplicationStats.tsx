import { computeApplicationStats } from "@/lib/applicationUtils";
import type { Application } from "@/lib/trackerTypes";
import { statusColors, statusLabel } from "@/lib/statusDisplay";

export default function ApplicationStats({
  applications,
}: {
  applications: Application[];
}) {
  const stats = computeApplicationStats(applications);

  const cells: { label: string; value: string | number; text: string; bg: string }[] = [
    { label: "Total Saved", value: stats.totalSaved, ...statusColors("Saved") },
    { label: "Applications Sent", value: stats.totalApplied, ...statusColors("Applied") },
    { label: "OAs", value: stats.oas, ...statusColors("OA") },
    { label: "Interviews", value: stats.interviews, ...statusColors("Interview") },
    { label: "Offers 🎉", value: stats.offers, ...statusColors("Offer") },
    { label: statusLabel("Rejected"), value: stats.rejected, ...statusColors("Rejected") },
    {
      label: "Success Rate",
      value: stats.successRate === null ? "—" : `${stats.successRate}%`,
      text: "var(--foreground)",
      bg: "var(--surface)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {cells.map((c) => (
        <div key={c.label} className="card-soft p-3" style={{ backgroundColor: c.bg }}>
          <p className="text-xs text-muted">{c.label}</p>
          <p className="mt-1 text-xl font-semibold" style={{ color: c.text }}>
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
}
