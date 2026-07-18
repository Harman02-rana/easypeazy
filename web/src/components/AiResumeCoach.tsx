"use client";

import { useState } from "react";
import { Check, GraduationCap, TrendingUp } from "lucide-react";
import { estimateImprovedScore } from "@/lib/atsAnalyzer";
import type { AtsAnalysisResult } from "@/lib/trackerTypes";

interface CoachItem {
  id: string;
  text: string;
}

function buildChecklist(result: AtsAnalysisResult): CoachItem[] {
  const items: CoachItem[] = [];
  for (const skill of result.missingSkills.slice(0, 5)) {
    items.push({ id: `skill-${skill}`, text: `Add ${skill} (if you genuinely have experience with it)` });
  }
  for (const suggestion of result.suggestions) {
    items.push({ id: `suggestion-${suggestion}`, text: suggestion });
  }
  if (result.aiInsights) {
    for (const s of result.aiInsights.suggestions) {
      items.push({ id: `ai-${s}`, text: s });
    }
  }
  return items;
}

/** A presentation layer over data the app already computes — the local
 * engine's missing skills/suggestions plus the optional AI insights — not
 * a new AI call. Checking items off is local UI state only (not persisted)
 * so this stays a lightweight "work through this" mentor view rather than
 * another thing to keep in sync. */
export default function AiResumeCoach({ result }: { result: AtsAnalysisResult }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const items = buildChecklist(result);
  const estimatedScore = estimateImprovedScore(result);

  if (items.length === 0) {
    return (
      <div className="card-soft p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" style={{ color: "var(--accent)" }} strokeWidth={2} />
          <p className="text-sm font-semibold text-foreground">AI Resume Coach</p>
        </div>
        <p className="mt-2 text-sm text-muted">
          Nothing major to flag — this resume already looks well aligned with the job description.
        </p>
      </div>
    );
  }

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="card-soft p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" style={{ color: "var(--accent)" }} strokeWidth={2} />
          <p className="text-sm font-semibold text-foreground">AI Resume Coach</p>
        </div>
        {estimatedScore > result.overallScore && (
          <span
            className="pill"
            style={{ backgroundColor: "var(--cat-offer-bg)", color: "var(--cat-offer)" }}
          >
            <TrendingUp className="mr-1 h-3 w-3" strokeWidth={2.5} />
            Est. {estimatedScore}/100 after fixes
          </span>
        )}
      </div>

      <ul className="mt-3 space-y-1.5">
        {items.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <li key={item.id}>
              <button
                onClick={() => toggle(item.id)}
                className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-surface-hover cursor-pointer"
              >
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                  style={
                    isChecked
                      ? { backgroundColor: "var(--cat-offer)", borderColor: "var(--cat-offer)" }
                      : { borderColor: "var(--border-strong)" }
                  }
                >
                  {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                </span>
                <span className={isChecked ? "text-muted line-through" : "text-foreground/90"}>{item.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
