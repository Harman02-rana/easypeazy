import { Lightbulb, TrendingUp } from "lucide-react";
import type { AtsAnalysisResult } from "@/lib/trackerTypes";

function Chip({ text, variant }: { text: string; variant: "warn" | "good" }) {
  const tint =
    variant === "warn"
      ? { bg: "var(--cat-rejected-bg)", text: "var(--cat-rejected)" }
      : { bg: "var(--cat-offer-bg)", text: "var(--cat-offer)" };
  return (
    <span className="badge" style={{ backgroundColor: tint.bg, color: tint.text }}>
      {text}
    </span>
  );
}

/** Derived entirely from analyses the user has already run — no new
 * computation beyond comparing the two most recent results for the
 * "most improved" signal. Renders nothing until there's at least one
 * analysis to draw from. */
export default function ResumeInsights({ analyses }: { analyses: AtsAnalysisResult[] }) {
  if (analyses.length === 0) return null;

  const sorted = [...analyses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const latest = sorted[0];
  const previous = sorted[1];

  const strongest = [...latest.categoryScores].sort((a, b) => b.score - a.score)[0];
  const weakest = [...latest.categoryScores].sort((a, b) => a.score - b.score)[0];

  let mostImproved: { label: string; delta: number } | null = null;
  if (previous) {
    for (const cat of latest.categoryScores) {
      const prevCat = previous.categoryScores.find((c) => c.category === cat.category);
      if (!prevCat) continue;
      const delta = cat.score - prevCat.score;
      if (delta > 0 && (!mostImproved || delta > mostImproved.delta)) {
        mostImproved = { label: cat.label, delta };
      }
    }
  }

  return (
    <div className="card-soft p-4">
      <div className="mb-3 flex items-center gap-2">
        <Lightbulb className="h-4 w-4" style={{ color: "var(--cat-planner)" }} strokeWidth={2} />
        <p className="text-sm font-semibold text-foreground">Resume Insights</p>
        <span className="text-xs text-muted">from your most recent analysis</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-muted">Missing skills</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {latest.missingSkills.length === 0 ? (
              <span className="text-xs text-muted">None detected.</span>
            ) : (
              latest.missingSkills.slice(0, 6).map((s) => <Chip key={s} text={s} variant="warn" />)
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted">Missing keywords</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {latest.missingKeywords.length === 0 ? (
              <span className="text-xs text-muted">None detected.</span>
            ) : (
              latest.missingKeywords.slice(0, 6).map((s) => <Chip key={s} text={s} variant="warn" />)
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted">Strongest section</p>
          <div className="mt-1.5">
            <Chip text={`${strongest.label} · ${strongest.score}`} variant="good" />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted">Weakest section</p>
          <div className="mt-1.5">
            <Chip text={`${weakest.label} · ${weakest.score}`} variant="warn" />
          </div>
        </div>
      </div>

      {mostImproved && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--cat-offer)" }} strokeWidth={2} />
          Most improved since your last analysis: <strong className="text-foreground">{mostImproved.label}</strong>{" "}
          (+{mostImproved.delta})
        </p>
      )}
    </div>
  );
}
