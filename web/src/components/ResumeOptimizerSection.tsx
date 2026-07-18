"use client";

import { useState } from "react";
import { AlertCircle, Check, Copy, Download, Loader2, Save, Sparkles } from "lucide-react";
import { fetchOptimizedResume } from "@/lib/resumeOptimizer";
import { downloadResumeAsPdf } from "@/lib/pdfExport";
import { useResumeVersions } from "@/hooks/useTracker";
import type { AtsAnalysisResult, ResumeRecord } from "@/lib/trackerTypes";
import ResumeDiffView from "./ResumeDiffView";

/** Deliberately takes `resume` and `analysis` as plain props rather than
 * reading them from a hook itself, so a future "Optimize for this job"
 * entry point (e.g. from a job card in the tracker) can mount this same
 * component with a synthesized analysis instead of one only reachable via
 * the ATS Analyzer page. */
export default function ResumeOptimizerSection({
  resume,
  analysis,
}: {
  resume: ResumeRecord;
  analysis: AtsAnalysisResult;
}) {
  const { saveVersion } = useResumeVersions();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimized, setOptimized] = useState<{ text: string; changeSummary: string[] } | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleOptimize() {
    setError(null);
    setIsOptimizing(true);
    setAccepted(false);
    setSaved(false);

    const { result, reason } = await fetchOptimizedResume({
      resumeText: resume.extractedText,
      jobDescription: analysis.jobDescription,
      companyName: analysis.companyName,
      jobRole: analysis.jobRole,
      analysis: {
        overallScore: analysis.overallScore,
        matchedSkills: analysis.matchedSkills,
        missingSkills: analysis.missingSkills,
        matchedKeywords: analysis.matchedKeywords,
        missingKeywords: analysis.missingKeywords,
      },
    });

    setIsOptimizing(false);
    if (!result) {
      setError(reason ?? "AI resume optimization is unavailable.");
      return;
    }
    setOptimized({ text: result.optimizedResume, changeSummary: result.changeSummary });
  }

  function handleCopy() {
    if (!optimized) return;
    navigator.clipboard
      .writeText(optimized.text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => setError("Couldn't copy to clipboard — your browser may be blocking it."));
  }

  function handleSaveVersion() {
    if (!optimized) return;
    const label = analysis.companyName
      ? `${analysis.companyName}${analysis.jobRole ? ` — ${analysis.jobRole}` : ""}`
      : analysis.jobRole || "Optimized resume";
    saveVersion({
      label,
      companyName: analysis.companyName,
      jobRole: analysis.jobRole,
      content: optimized.text,
      changeSummary: optimized.changeSummary,
      sourceAnalysisId: analysis.id,
    });
    setSaved(true);
  }

  return (
    <div className="card-soft space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: "var(--accent)" }} strokeWidth={2} />
          <p className="text-sm font-semibold text-foreground">Optimize Resume</p>
        </div>
        <button onClick={handleOptimize} className="btn-primary-sm" disabled={isOptimizing}>
          {isOptimizing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
          ) : (
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
          )}
          {isOptimizing ? "Optimizing..." : optimized ? "Re-optimize" : "Optimize Resume"}
        </button>
      </div>

      {!optimized && !isOptimizing && !error && (
        <p className="text-xs text-muted">
          Tailors your resume&apos;s wording to this job description — it only rewrites what&apos;s already
          there, and never adds skills, experience, or numbers that aren&apos;t genuinely yours.
        </p>
      )}

      {error && (
        <div
          className="flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--cat-rejected)", backgroundColor: "var(--cat-rejected-bg)", color: "var(--cat-rejected)" }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {optimized && (
        <>
          <ResumeDiffView original={resume.extractedText} optimized={optimized.text} />

          {optimized.changeSummary.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted">What changed</p>
              <ul className="mt-1.5 space-y-1 text-sm text-foreground/90">
                {optimized.changeSummary.map((s, i) => (
                  <li key={i}>&bull; {s}</li>
                ))}
              </ul>
            </div>
          )}

          {!accepted ? (
            <button onClick={() => setAccepted(true)} className="btn-primary">
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
              Accept all changes
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button onClick={handleCopy} className="btn-secondary">
                <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                {copied ? "Copied!" : "Copy optimized resume"}
              </button>
              <button
                onClick={() => downloadResumeAsPdf(optimized.text, `${analysis.companyName || "resume"}-optimized`)}
                className="btn-secondary"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={2} />
                Download as PDF
              </button>
              <button onClick={handleSaveVersion} className="btn-secondary" disabled={saved}>
                <Save className="h-3.5 w-3.5" strokeWidth={2} />
                {saved ? "Saved" : "Save version"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
