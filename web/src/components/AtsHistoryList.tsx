import { History, X } from "lucide-react";
import type { AtsAnalysisResult } from "@/lib/trackerTypes";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function AtsHistoryList({
  analyses,
  onSelect,
  onRemove,
}: {
  analyses: AtsAnalysisResult[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  if (analyses.length === 0) return null;

  return (
    <div className="card-soft p-4">
      <div className="mb-2 flex items-center gap-2">
        <History className="h-4 w-4 text-muted" strokeWidth={2} />
        <p className="text-sm font-semibold text-foreground">Previous analyses</p>
      </div>
      <div className="flex flex-col gap-1">
        {analyses.map((a) => (
          <div key={a.id} className="row-hover flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
            <button
              onClick={() => onSelect(a.id)}
              className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm cursor-pointer"
            >
              <span className="font-semibold text-foreground">{a.overallScore}</span>
              <span className="truncate text-muted">
                {a.companyName || "Untitled"} {a.jobRole && `· ${a.jobRole}`} · {formatDate(a.createdAt)}
              </span>
            </button>
            <button
              onClick={() => onRemove(a.id)}
              aria-label="Remove analysis"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
