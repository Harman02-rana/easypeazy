import { diffResumeText } from "@/lib/textDiff";

export default function ResumeDiffView({ original, optimized }: { original: string; optimized: string }) {
  const diff = diffResumeText(original, optimized);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card-soft p-4">
        <p className="mb-2 text-sm font-semibold text-foreground">Original</p>
        <div
          className="max-h-[32rem] overflow-y-auto rounded-lg border border-border p-3"
          style={{ backgroundColor: "var(--background)" }}
        >
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
            {diff.map((part, i) =>
              part.added ? null : (
                <span
                  key={i}
                  style={
                    part.removed
                      ? { backgroundColor: "var(--cat-rejected-bg)", color: "var(--cat-rejected)", textDecoration: "line-through" }
                      : undefined
                  }
                >
                  {part.value}
                </span>
              )
            )}
          </pre>
        </div>
      </div>

      <div className="card-soft p-4">
        <p className="mb-2 text-sm font-semibold text-foreground">Optimized</p>
        <div
          className="max-h-[32rem] overflow-y-auto rounded-lg border border-border p-3"
          style={{ backgroundColor: "var(--background)" }}
        >
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/90">
            {diff.map((part, i) =>
              part.removed ? null : (
                <span
                  key={i}
                  style={
                    part.added
                      ? { backgroundColor: "var(--cat-offer-bg)", color: "var(--cat-offer)", fontWeight: 600 }
                      : undefined
                  }
                >
                  {part.value}
                </span>
              )
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
