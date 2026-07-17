import type { Metadata } from "next";
import { Radio } from "lucide-react";
import OngoingHiringDashboard from "@/components/OngoingHiringDashboard";
import { getOngoingHiringJobs } from "@/lib/ongoingHiring";
import { getLastFetchedAt, getLastFetchResults } from "@/lib/liveJobs";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `Ongoing Hiring — ${SITE_NAME}`,
};

function formatFetchedAt(iso: string | null): string {
  if (!iso) return "Never fetched yet — run GET /api/refresh-jobs locally to pull live data.";
  return `Last refreshed ${new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })}`;
}

export default function OngoingHiringPage() {
  const jobs = getOngoingHiringJobs();
  const fetchedAt = getLastFetchedAt();
  const results = getLastFetchResults();
  const failed = results.filter((r) => !r.ok);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <Radio className="h-6 w-6 text-muted" strokeWidth={2} />
        Ongoing Hiring
      </h1>
      <p className="mt-1 text-sm text-muted">
        Live roles pulled directly from official Greenhouse/Lever/Ashby company boards —
        {" "}
        {formatFetchedAt(fetchedAt)}
      </p>
      {failed.length > 0 && (
        <p className="mt-1 text-xs text-muted">
          {failed.length} source{failed.length === 1 ? "" : "s"} didn&rsquo;t respond on the
          last refresh ({failed.map((f) => f.companyName).join(", ")}) — everything else
          below is unaffected.
        </p>
      )}

      <div className="mt-6">
        <OngoingHiringDashboard liveJobs={jobs} />
      </div>
    </div>
  );
}
