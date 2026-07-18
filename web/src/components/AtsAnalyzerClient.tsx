"use client";

import { useState } from "react";
import Link from "next/link";
import { FileWarning } from "lucide-react";
import { useResume, useAtsAnalyses } from "@/hooks/useTracker";
import { analyzeResume, AtsAnalysisError } from "@/lib/atsAnalyzer";
import { fetchAiInsights } from "@/lib/atsInsights";
import type { AtsAnalysisResult } from "@/lib/trackerTypes";
import AtsAnalyzerForm, { type AtsAnalyzerInput } from "./AtsAnalyzerForm";
import AtsScoreOverview from "./AtsScoreOverview";
import AtsSkillsKeywordsPanel from "./AtsSkillsKeywordsPanel";
import AtsSuggestionsPanel from "./AtsSuggestionsPanel";
import AtsHistoryList from "./AtsHistoryList";
import ResumeOptimizerSection from "./ResumeOptimizerSection";
import ResumeVersionManager from "./ResumeVersionManager";

export default function AtsAnalyzerClient() {
  const { resume, hydrated: resumeHydrated } = useResume();
  const { items: analyses, hydrated: analysesHydrated, add, update, remove } = useAtsAnalyses();

  const [current, setCurrent] = useState<AtsAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  if (!resumeHydrated || !analysesHydrated) return null;

  if (!resume) {
    return (
      <div className="card-soft flex items-start gap-3 p-5">
        <FileWarning className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--cat-rejected)" }} strokeWidth={2} />
        <div>
          <p className="text-sm font-medium text-foreground">No resume uploaded yet</p>
          <p className="mt-1 text-sm text-muted">
            Upload a resume in Resume Studio first — this analyzer reads the text already extracted there.
          </p>
          <Link href="/resume-studio" className="btn-secondary-sm mt-3">
            Go to Resume Studio
          </Link>
        </div>
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

      {current && (
        <>
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-6">
              <AtsScoreOverview result={current} />
              <AtsSkillsKeywordsPanel result={current} />
            </div>
            <AtsSuggestionsPanel
              suggestions={current.suggestions}
              aiInsights={current.aiInsights}
              aiLoading={aiLoading && current.aiInsights === null}
            />
          </div>

          <ResumeOptimizerSection resume={resume} analysis={current} />
        </>
      )}

      <AtsHistoryList analyses={analyses} onSelect={handleSelectHistory} onRemove={handleRemoveHistory} />

      <ResumeVersionManager masterResumeText={resume.extractedText} />
    </div>
  );
}
