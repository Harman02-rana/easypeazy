import ProgressBar from "./ProgressBar";
import type { AtsAnalysisResult } from "@/lib/trackerTypes";

function scoreTint(score: number): { text: string; bg: string } {
  if (score >= 75) return { text: "var(--cat-offer)", bg: "var(--cat-offer-bg)" };
  if (score >= 50) return { text: "var(--cat-interview)", bg: "var(--cat-interview-bg)" };
  return { text: "var(--cat-rejected)", bg: "var(--cat-rejected-bg)" };
}

export default function AtsScoreOverview({ result }: { result: AtsAnalysisResult }) {
  const tint = scoreTint(result.overallScore);

  return (
    <div className="card-soft p-5">
      <div className="flex flex-wrap items-center gap-5">
        <div
          className="flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-full border-4"
          style={{ borderColor: tint.text, color: tint.text }}
        >
          <span className="text-3xl font-bold tracking-tight">{result.overallScore}</span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted">/ 100</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">ATS Compatibility Estimate</p>
          <p className="mt-1 text-xs text-muted">
            {result.companyName && `${result.companyName} · `}
            {result.jobRole || "Role not specified"}
          </p>
          <p className="mt-1 text-xs text-muted">
            Based on {result.resumeFileName} against the pasted job description.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {result.categoryScores.map((cat) => (
          <div key={cat.category}>
            <ProgressBar value={cat.score} label={cat.label} />
            <p className="mt-1 text-[11px] text-muted">{cat.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
