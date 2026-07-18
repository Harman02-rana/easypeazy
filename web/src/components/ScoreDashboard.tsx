import ProgressBar from "./ProgressBar";
import { scoreTint } from "@/lib/scoreTint";

/** Shared "big score circle + category bars" layout — used for both the
 * ATS Compatibility Estimate and the job-independent Resume Health score,
 * so the two feel like one consistent design language instead of two
 * different dashboards bolted together. */
export default function ScoreDashboard({
  title,
  subtitle,
  overallScore,
  categories,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  overallScore: number;
  categories: { label: string; score: number; note: string }[];
  /** Smaller circle + no per-category notes — for tight spaces like a card. */
  compact?: boolean;
}) {
  const tint = scoreTint(overallScore);

  return (
    <div className={compact ? "" : "card-soft p-5"}>
      <div className="flex flex-wrap items-center gap-4">
        <div
          className={`flex shrink-0 flex-col items-center justify-center rounded-full border-4 ${
            compact ? "h-14 w-14" : "h-24 w-24"
          }`}
          style={{ borderColor: tint.text, color: tint.text }}
        >
          <span className={compact ? "text-lg font-bold tracking-tight" : "text-3xl font-bold tracking-tight"}>
            {overallScore}
          </span>
          {!compact && <span className="text-[10px] font-medium uppercase tracking-wide text-muted">/ 100</span>}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
        </div>
      </div>

      <div className={compact ? "mt-3 space-y-2" : "mt-5 space-y-3"}>
        {categories.map((cat, i) => (
          <div key={i}>
            <ProgressBar value={cat.score} label={cat.label} />
            {!compact && <p className="mt-1 text-[11px] text-muted">{cat.note}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
