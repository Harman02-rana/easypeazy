"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export interface AtsAnalyzerInput {
  jobDescription: string;
  companyName: string;
  jobRole: string;
}

export default function AtsAnalyzerForm({
  onAnalyze,
  isAnalyzing,
  initial,
}: {
  onAnalyze: (input: AtsAnalyzerInput) => void;
  isAnalyzing: boolean;
  /** Lets a future caller (e.g. an "Analyze My Resume" button on a job
   * card) pre-fill company/role/JD without this form needing to change. */
  initial?: Partial<AtsAnalyzerInput>;
}) {
  const [jobDescription, setJobDescription] = useState(initial?.jobDescription ?? "");
  const [companyName, setCompanyName] = useState(initial?.companyName ?? "");
  const [jobRole, setJobRole] = useState(initial?.jobRole ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!jobDescription.trim() || isAnalyzing) return;
        onAnalyze({ jobDescription, companyName, jobRole });
      }}
      className="card-soft space-y-3 p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Company (optional)
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Role (optional)
          <input
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Software Engineer Intern"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Job description
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={10}
          placeholder="Paste the full job description here..."
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          required
        />
      </label>

      <button type="submit" className="btn-primary" disabled={isAnalyzing || !jobDescription.trim()}>
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
        {isAnalyzing ? "Analyzing..." : "Analyze my resume"}
      </button>
    </form>
  );
}
