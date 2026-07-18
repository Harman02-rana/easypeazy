import { History, RotateCw, Sparkles, Trash2 } from "lucide-react";
import { scoreTint } from "@/lib/scoreTint";
import type { AtsAnalysisResult } from "@/lib/trackerTypes";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function AtsHistoryList({
  analyses,
  onSelect,
  onReanalyze,
  onOptimize,
  onRemove,
}: {
  analyses: AtsAnalysisResult[];
  onSelect: (id: string) => void;
  onReanalyze: (analysis: AtsAnalysisResult) => void;
  onOptimize: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  if (analyses.length === 0) return null;

  return (
    <div className="card-soft p-4">
      <div className="mb-3 flex items-center gap-2">
        <History className="h-4 w-4 text-muted" strokeWidth={2} />
        <p className="text-sm font-semibold text-foreground">Previous analyses</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {analyses.map((a) => {
          const tint = scoreTint(a.overallScore);
          return (
            <div key={a.id} className="rounded-lg border border-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{a.companyName || "Untitled"}</p>
                  <p className="truncate text-xs text-muted">{a.jobRole || "Role not specified"}</p>
                </div>
                <span className="badge shrink-0" style={{ backgroundColor: tint.bg, color: tint.text }}>
                  {a.overallScore}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted">{formatDate(a.createdAt)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <button onClick={() => onSelect(a.id)} className="btn-secondary-sm">
                  Open
                </button>
                <button onClick={() => onReanalyze(a)} className="btn-secondary-sm">
                  <RotateCw className="h-3 w-3" strokeWidth={2} />
                  Reanalyze
                </button>
                <button onClick={() => onOptimize(a.id)} className="btn-secondary-sm">
                  <Sparkles className="h-3 w-3" strokeWidth={2} />
                  Optimize
                </button>
                <button
                  onClick={() => onRemove(a.id)}
                  aria-label="Remove analysis"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" strokeWidth={2} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
