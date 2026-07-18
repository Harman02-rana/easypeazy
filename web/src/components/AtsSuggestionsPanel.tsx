import { Lightbulb, Loader2, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import type { AiInsights } from "@/lib/trackerTypes";

export default function AtsSuggestionsPanel({
  suggestions,
  aiInsights,
  aiLoading,
}: {
  suggestions: string[];
  aiInsights: AiInsights | null;
  aiLoading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="card-soft p-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" style={{ color: "var(--cat-planner)" }} strokeWidth={2} />
          <p className="text-sm font-semibold text-foreground">Improvement suggestions</p>
        </div>
        {suggestions.length === 0 ? (
          <p className="mt-2 text-xs text-muted">Nothing major stood out — this resume looks well aligned with the job description.</p>
        ) : (
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/90">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current text-muted" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {aiLoading && (
        <div className="card-soft flex items-center gap-2 p-4 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          Getting AI insights...
        </div>
      )}

      {!aiLoading && aiInsights && (
        <div
          className="card-soft space-y-4 p-4"
          style={{ background: "linear-gradient(155deg, var(--accent-soft-bg) 0%, var(--cat-study-bg) 100%)" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: "var(--accent)" }} strokeWidth={2} />
            <p className="text-sm font-semibold text-foreground">AI insights</p>
          </div>

          <p className="text-sm text-foreground/90">{aiInsights.roleRelevance}</p>

          {aiInsights.strengths.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <ThumbsUp className="h-3.5 w-3.5" style={{ color: "var(--cat-offer)" }} strokeWidth={2} />
                Strengths
              </p>
              <ul className="mt-1.5 space-y-1 text-sm text-foreground/90">
                {aiInsights.strengths.map((s, i) => (
                  <li key={i}>&bull; {s}</li>
                ))}
              </ul>
            </div>
          )}

          {aiInsights.weaknesses.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
                <ThumbsDown className="h-3.5 w-3.5" style={{ color: "var(--cat-rejected)" }} strokeWidth={2} />
                Weak areas
              </p>
              <ul className="mt-1.5 space-y-1 text-sm text-foreground/90">
                {aiInsights.weaknesses.map((s, i) => (
                  <li key={i}>&bull; {s}</li>
                ))}
              </ul>
            </div>
          )}

          {aiInsights.suggestions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted">Contextual suggestions</p>
              <ul className="mt-1.5 space-y-1 text-sm text-foreground/90">
                {aiInsights.suggestions.map((s, i) => (
                  <li key={i}>&bull; {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
