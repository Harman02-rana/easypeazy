"use client";

import { useState } from "react";
import Link from "next/link";
import { FileSearch, FileWarning } from "lucide-react";
import { useResume, useAtsAnalyses } from "@/hooks/useTracker";
import { analyzeResume, AtsAnalysisError } from "@/lib/atsAnalyzer";
import { fetchAiInsights } from "@/lib/atsInsights";
import type { AtsAnalysisResult } from "@/lib/trackerTypes";
import AtsAnalyzerForm, { type AtsAnalyzerInput } from "./AtsAnalyzerForm";
import AtsScoreOverview from "./AtsScoreOverview";
import AtsSkillsKeywordsPanel from "./AtsSkillsKeywordsPanel";
import AtsSuggestionsPanel from "./AtsSuggestionsPanel";
import AtsHistoryList from "./AtsHistoryList";
import AiResumeCoach from "./AiResumeCoach";
import ResumeInsights from "./ResumeInsights";
import ResumeOptimizerSection from "./ResumeOptimizerSection";
import ResumeVersionManager from "./ResumeVersionManager";
import ResumeWorkspaceSkeleton from "./ResumeWorkspaceSkeleton";

export default function AtsAnalyzerClient() {
  const { resume, hydrated: resumeHydrated } = useResume();
  const { items: analyses, hydrated: analysesHydrated, add, update, remove } = useAtsAnalyses();

  const [current, setCurrent] = useState<AtsAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  if (!resumeHydrated || !analysesHydrated) return <ResumeWorkspaceSkeleton />;

  if (!resume) {
    return (
      <div className="card-soft flex flex-col items-center gap-3 px-6 py-14 text-center">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--cat-applications-bg)", color: "var(--cat-applications)" }}
        >
          <FileSearch className="h-6 w-6" strokeWidth={2} />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">No resume uploaded yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            Upload a resume in Resume Studio first — the ATS Analyzer reads the text already extracted
            there and scores it against any job description you paste.
          </p>
        </div>
        <Link href="/resume-studio" className="btn-primary mt-1">
          Go to Resume Studio
        </Link>
      </div>
    );
  }

  async function handleAnalyze(input: AtsAnalyzerInput) {
    if (!resume) return;
    setError(null);
    setIsAnalyzing(true);
    try {
      const result = analyzeResume({
        resumeText: resume.extractedText,
        resumeFileName: resume.fileName,
        jobDescription: input.jobDescription,
        companyName: input.companyName,
        jobRole: input.jobRole,
      });
      setCurrent(result);
      add(result);
      setIsAnalyzing(false);

      setAiLoading(true);
      const insights = await fetchAiInsights(resume.extractedText, result);
      setAiLoading(false);
      if (insights) {
        const withInsights = { ...result, aiInsights: insights };
        setCurrent((prev) => (prev?.id === result.id ? withInsights : prev));
        update(result.id, { aiInsights: insights });
      }
    } catch (err) {
      setIsAnalyzing(false);
      setError(err instanceof AtsAnalysisError ? err.message : "Something went wrong analyzing your resume.");
    }
  }

  function handleSelectHistory(id: string) {
    const found = analyses.find((a) => a.id === id);
    if (found) setCurrent(found);
  }

  function handleReanalyze(analysis: AtsAnalysisResult) {
    handleAnalyze({
      jobDescription: analysis.jobDescription,
      companyName: analysis.companyName,
      jobRole: analysis.jobRole,
    });
  }

  function handleOptimizeFromHistory(id: string) {
    handleSelectHistory(id);
    requestAnimationFrame(() => {
      document.getElementById("resume-optimizer-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function handleRemoveHistory(id: string) {
    remove(id);
    setCurrent((prev) => (prev?.id === id ? null : prev));
  }

  return (
    <div className="space-y-6">
      <AtsAnalyzerForm onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

      {error && (
        <div
          className="flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--cat-rejected)", backgroundColor: "var(--cat-rejected-bg)", color: "var(--cat-rejected)" }}
        >
          <FileWarning className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {!current && analyses.length === 0 && !error && (
        <div className="card-soft flex flex-col items-center gap-2 px-6 py-12 text-center">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--cat-study-bg)", color: "var(--cat-study)" }}
          >
            <FileSearch className="h-5 w-5" strokeWidth={2} />
          </span>
          <p className="text-sm font-medium text-foreground">No analysis yet</p>
          <p className="mx-auto max-w-md text-sm text-muted">
            Paste a job description above and click Analyze — the local scoring engine checks your resume
            for skills match, keyword overlap, experience/project relevance, education match, and
            structure, all in your browser. No account or API key needed for this part.
          </p>
        </div>
      )}

      {current && (
        <>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-6">
              <AtsScoreOverview result={current} />
              <AtsSkillsKeywordsPanel result={current} />
            </div>
            <div className="space-y-6">
              <AiResumeCoach result={current} />
              <AtsSuggestionsPanel
                aiInsights={current.aiInsights}
                aiLoading={aiLoading && current.aiInsights === null}
              />
            </div>
          </div>

          <div id="resume-optimizer-section">
            <ResumeOptimizerSection resume={resume} analysis={current} />
          </div>
        </>
      )}

      <ResumeInsights analyses={analyses} />

      <AtsHistoryList
        analyses={analyses}
        onSelect={handleSelectHistory}
        onReanalyze={handleReanalyze}
        onOptimize={handleOptimizeFromHistory}
        onRemove={handleRemoveHistory}
      />

      <ResumeVersionManager />
    </div>
  );
}
