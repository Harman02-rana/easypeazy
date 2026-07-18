import { Check, X } from "lucide-react";
import type { AtsAnalysisResult } from "@/lib/trackerTypes";

function BadgeList({ items, variant }: { items: string[]; variant: "matched" | "missing" }) {
  if (items.length === 0) {
    return <p className="text-xs text-muted">None detected.</p>;
  }
  const tint =
    variant === "matched"
      ? { text: "var(--cat-offer)", bg: "var(--cat-offer-bg)" }
      : { text: "var(--cat-rejected)", bg: "var(--cat-rejected-bg)" };
  const Icon = variant === "matched" ? Check : X;

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="badge" style={{ backgroundColor: tint.bg, color: tint.text }}>
          <Icon className="mr-1 h-3 w-3" strokeWidth={2.5} />
          {item}
        </span>
      ))}
    </div>
  );
}

export default function AtsSkillsKeywordsPanel({ result }: { result: AtsAnalysisResult }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="card-soft p-4">
        <p className="text-sm font-semibold text-foreground">Matched skills</p>
        <div className="mt-2">
          <BadgeList items={result.matchedSkills} variant="matched" />
        </div>
      </div>
      <div className="card-soft p-4">
        <p className="text-sm font-semibold text-foreground">Missing skills</p>
        <div className="mt-2">
          <BadgeList items={result.missingSkills} variant="missing" />
        </div>
      </div>
      <div className="card-soft p-4">
        <p className="text-sm font-semibold text-foreground">Matched keywords</p>
        <div className="mt-2">
          <BadgeList items={result.matchedKeywords} variant="matched" />
        </div>
      </div>
      <div className="card-soft p-4">
        <p className="text-sm font-semibold text-foreground">Missing keywords</p>
        <div className="mt-2">
          <BadgeList items={result.missingKeywords} variant="missing" />
        </div>
      </div>
    </div>
  );
}
