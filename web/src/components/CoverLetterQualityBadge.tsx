import { Check, X } from "lucide-react";
import type { CoverLetterQualityCheck } from "@/lib/trackerTypes";
import { isReadyToSend } from "@/lib/coverLetterQuality";

/** Combines the local deterministic checks (company/role mentioned, no
 * placeholder text) with the AI's own tone/grammar self-assessment into
 * one "Ready to Send" verdict — matching the app's established pattern of
 * local engine as ground truth, AI as a supplementary signal. */
export default function CoverLetterQualityBadge({ check }: { check: CoverLetterQualityCheck | null }) {
  if (!check) return null;

  const ready = isReadyToSend(check);
  const items: { label: string; ok: boolean }[] = [
    { label: "Company name mentioned", ok: check.companyNameMentioned },
    { label: "Job title mentioned", ok: check.jobTitleMentioned },
    { label: "No placeholder text", ok: check.noPlaceholderText },
    { label: "Tone consistent", ok: check.toneConsistent },
    { label: "Grammar correct", ok: check.grammarCorrect },
  ];

  return (
    <div className="card-soft p-4">
      {ready ? (
        <span className="pill" style={{ backgroundColor: "var(--cat-offer-bg)", color: "var(--cat-offer)" }}>
          <Check className="mr-1 h-3 w-3" strokeWidth={2.5} />
          Ready to Send
        </span>
      ) : (
        <span className="pill" style={{ backgroundColor: "var(--cat-interview-bg)", color: "var(--cat-interview)" }}>
          Needs a look
        </span>
      )}

      <ul className="mt-2.5 space-y-1 text-xs text-muted">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {item.ok ? (
              <Check className="h-3 w-3 shrink-0" style={{ color: "var(--cat-offer)" }} strokeWidth={2.5} />
            ) : (
              <X className="h-3 w-3 shrink-0" style={{ color: "var(--cat-rejected)" }} strokeWidth={2.5} />
            )}
            {item.label}
          </li>
        ))}
      </ul>

      {check.notes.length > 0 && (
        <ul className="mt-2.5 space-y-1 border-t border-border pt-2.5 text-xs text-foreground/80">
          {check.notes.map((n, i) => (
            <li key={i}>&bull; {n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
