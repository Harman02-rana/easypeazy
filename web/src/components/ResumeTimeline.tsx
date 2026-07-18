import { ArrowDown, GitBranch } from "lucide-react";
import type { ResumeVersion } from "@/lib/trackerTypes";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

/** A simple chronological chain, not a real branching graph — versions
 * don't currently track which version they were optimized from, so this
 * shows creation order rather than true lineage. Still gives a quick
 * sense of "how did this resume evolve" without inventing data we don't
 * actually have. */
export default function ResumeTimeline({ versions }: { versions: ResumeVersion[] }) {
  const master = versions.find((v) => v.isMaster);
  const ordered = versions.filter((v) => !v.isMaster).sort((a, b) => a.versionNumber - b.versionNumber);
  const chain = master ? [master, ...ordered] : ordered;

  if (chain.length <= 1) return null;

  return (
    <div className="card-soft p-4">
      <div className="mb-3 flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-muted" strokeWidth={2} />
        <p className="text-sm font-semibold text-foreground">Resume Timeline</p>
      </div>
      <div className="flex flex-col items-start">
        {chain.map((v, i) => (
          <div key={v.id} className="flex flex-col items-start">
            <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm">
              <span className="font-medium text-foreground">
                {v.isMaster ? "⭐ Master Resume" : v.label}
              </span>
              <span className="text-xs text-muted">{formatDate(v.createdAt)}</span>
            </div>
            {i < chain.length - 1 && <ArrowDown className="my-1 ml-4 h-4 w-4 text-muted" strokeWidth={2} />}
          </div>
        ))}
      </div>
    </div>
  );
}
