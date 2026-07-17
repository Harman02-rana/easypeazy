import {
  Award,
  Bookmark,
  ClipboardCheck,
  HeartCrack,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";
import { computeApplicationStats } from "@/lib/applicationUtils";
import type { Application } from "@/lib/trackerTypes";
import { statusColors, statusLabel } from "@/lib/statusDisplay";
import StatCard from "./StatCard";

export default function ApplicationStats({
  applications,
}: {
  applications: Application[];
}) {
  const stats = computeApplicationStats(applications);

  const cells = [
    { label: "Total Saved", value: stats.totalSaved, icon: Bookmark, ...statusColors("Saved") },
    { label: "Applications Sent", value: stats.totalApplied, icon: Send, ...statusColors("Applied") },
    { label: "OAs", value: stats.oas, icon: ClipboardCheck, ...statusColors("OA") },
    { label: "Interviews", value: stats.interviews, icon: Users, ...statusColors("Interview") },
    { label: "Offers 🎉", value: stats.offers, icon: Award, ...statusColors("Offer") },
    {
      label: statusLabel("Rejected"),
      value: stats.rejected,
      icon: HeartCrack,
      ...statusColors("Rejected"),
    },
    {
      label: "Success Rate",
      value: stats.successRate === null ? "—" : `${stats.successRate}%`,
      icon: TrendingUp,
      text: "var(--accent)",
      bg: "var(--accent-soft-bg)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {cells.map((c) => (
        <StatCard key={c.label} {...c} />
      ))}
    </div>
  );
}
