import { Loader2, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import type { AiInsights } from "@/lib/trackerTypes";

/** Purely the AI's qualitative narrative (role relevance + strengths +
 * weaknesses) — the actionable "what to fix" checklist lives in
 * AiResumeCoach instead, which already folds in both the local engine's
 * suggestions and the AI's contextual ones. Keeping both here too would
 * just repeat the same list twice on the page. */
export default function AtsSuggestionsPanel({
  aiInsights,
  aiLoading,
}: {
  aiInsights: AiInsights | null;
  aiLoading: boolean;
}) {
  if (!aiLoading && !aiInsights) return null;

  return (
    <div className="space-y-4">
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
        </div>
      )}
    </div>
  );
}
