"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { WRITING_STYLES } from "@/lib/trackerTypes";
import type { AtsAnalysisResult, ResumeVersion, WritingStyle } from "@/lib/trackerTypes";
import { WRITING_STYLE_LABELS } from "@/lib/writingStyleLabels";

export interface CoverLetterGeneratorInput {
  resumeVersionId: string;
  companyName: string;
  jobRole: string;
  jobDescription: string;
  writingStyle: WritingStyle;
}

export default function CoverLetterGeneratorForm({
  resumeVersions,
  analyses,
  isGenerating,
  onGenerate,
}: {
  resumeVersions: ResumeVersion[];
  analyses: AtsAnalysisResult[];
  isGenerating: boolean;
  onGenerate: (input: CoverLetterGeneratorInput) => void;
}) {
  const [resumeVersionId, setResumeVersionId] = useState(resumeVersions[0]?.id ?? "");
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [writingStyle, setWritingStyle] = useState<WritingStyle>("professional");

  function prefillFromAnalysis(id: string) {
    const a = analyses.find((x) => x.id === id);
    if (!a) return;
    setCompanyName(a.companyName);
    setJobRole(a.jobRole);
    setJobDescription(a.jobDescription);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!resumeVersionId || !companyName.trim() || !jobRole.trim() || !jobDescription.trim() || isGenerating) return;
        onGenerate({ resumeVersionId, companyName, jobRole, jobDescription, writingStyle });
      }}
      className="card-soft space-y-3 p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Resume version
          <select
            value={resumeVersionId}
            onChange={(e) => setResumeVersionId(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            {resumeVersions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.isMaster ? "Master Resume" : v.label}
              </option>
            ))}
          </select>
        </label>
        {analyses.length > 0 && (
          <label className="flex flex-col gap-1 text-xs text-muted">
            Prefill from a previous analysis (optional)
            <select
              defaultValue=""
              onChange={(e) => e.target.value && prefillFromAnalysis(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            >
              <option value="">— Select —</option>
              {analyses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.companyName || "Untitled"} · {a.jobRole || "Role"}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Company
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google"
            required
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Job title
          <input
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Software Engineer Intern"
            required
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Job description
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          placeholder="Paste the job description here..."
          required
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <div>
        <p className="mb-1.5 text-xs text-muted">Writing style</p>
        <div className="flex flex-wrap gap-1.5">
          {WRITING_STYLES.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => setWritingStyle(style)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer"
              style={
                writingStyle === style
                  ? { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" }
                  : { color: "var(--muted)", border: "1px solid var(--border)" }
              }
            >
              {WRITING_STYLE_LABELS[style]}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={isGenerating || !resumeVersionId}>
        {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} /> : <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />}
        {isGenerating ? "Generating..." : "Generate Cover Letter"}
      </button>
    </form>
  );
}
