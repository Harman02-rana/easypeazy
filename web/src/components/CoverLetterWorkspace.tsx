"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Copy, FileText, Loader2, Save } from "lucide-react";
import { useAtsAnalyses, useCoverLetters, useResume, useResumeVersions } from "@/hooks/useTracker";
import { fetchGeneratedCoverLetter } from "@/lib/coverLetterGenerator";
import { runLocalQualityChecks } from "@/lib/coverLetterQuality";
import type { CoverLetter, WritingStyle } from "@/lib/trackerTypes";
import CoverLetterGeneratorForm, { type CoverLetterGeneratorInput } from "./CoverLetterGeneratorForm";
import CoverLetterEditor from "./CoverLetterEditor";
import CoverLetterQualityBadge from "./CoverLetterQualityBadge";
import CoverLetterCard from "./CoverLetterCard";
import ResumeWorkspaceSkeleton from "./ResumeWorkspaceSkeleton";

interface Draft {
  content: string;
  companyName: string;
  jobRole: string;
  jobDescription: string;
  writingStyle: WritingStyle;
  resumeVersionId: string;
  resumeVersionLabel: string;
  toneConsistent: boolean;
  grammarCorrect: boolean;
  notes: string[];
}

const AUTOSAVE_DEBOUNCE_MS = 800;

export default function CoverLetterWorkspace() {
  const { resume, hydrated: resumeHydrated } = useResume();
  const { items: resumeVersions, hydrated: versionsHydrated } = useResumeVersions();
  const { items: analyses, hydrated: analysesHydrated } = useAtsAnalyses();
  const {
    items: letters,
    hydrated: lettersHydrated,
    saveNew,
    renameLetter,
    updateContent,
    duplicateLetter,
    remove,
  } = useCoverLetters();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const [activeLetterId, setActiveLetterId] = useState<string | null>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hydrated = resumeHydrated && versionsHydrated && analysesHydrated && lettersHydrated;

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, []);

  if (!hydrated) return <ResumeWorkspaceSkeleton />;

  if (!resume || resumeVersions.length === 0) {
    return (
      <div className="card-soft flex flex-col items-center gap-3 px-6 py-14 text-center">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--cat-sister-bg)", color: "var(--cat-sister)" }}
        >
          <FileText className="h-6 w-6" strokeWidth={2} />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">No resume uploaded yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            Upload a resume in Resume Studio first — the cover letter generator reads your Master Resume
            or any saved version to write a letter genuinely grounded in your real experience.
          </p>
        </div>
        <Link href="/resume-studio" className="btn-primary mt-1">
          Go to Resume Studio
        </Link>
      </div>
    );
  }

  async function handleGenerate(input: CoverLetterGeneratorInput) {
    const version = resumeVersions.find((v) => v.id === input.resumeVersionId);
    if (!version) return;

    setError(null);
    setIsGenerating(true);
    setDraft(null);
    setActiveLetterId(null);

    const { result, reason } = await fetchGeneratedCoverLetter({
      resumeText: version.content,
      jobDescription: input.jobDescription,
      companyName: input.companyName,
      jobRole: input.jobRole,
      writingStyle: input.writingStyle,
    });

    setIsGenerating(false);
    if (!result) {
      setError(reason ?? "AI cover letter generation is unavailable.");
      return;
    }

    setDraft({
      content: result.content,
      companyName: input.companyName,
      jobRole: input.jobRole,
      jobDescription: input.jobDescription,
      writingStyle: input.writingStyle,
      resumeVersionId: version.id,
      resumeVersionLabel: version.isMaster ? "Master Resume" : version.label,
      toneConsistent: result.toneConsistent,
      grammarCorrect: result.grammarCorrect,
      notes: result.notes,
    });
  }

  function handleSaveDraft() {
    if (!draft) return;
    const label = `${draft.companyName} — ${draft.jobRole}`;
    const qualityCheck = runLocalQualityChecks({
      content: draft.content,
      companyName: draft.companyName,
      jobRole: draft.jobRole,
      aiToneConsistent: draft.toneConsistent,
      aiGrammarCorrect: draft.grammarCorrect,
      aiNotes: draft.notes,
    });
    saveNew({
      label,
      companyName: draft.companyName,
      jobRole: draft.jobRole,
      jobDescription: draft.jobDescription,
      writingStyle: draft.writingStyle,
      resumeVersionId: draft.resumeVersionId,
      resumeVersionLabel: draft.resumeVersionLabel,
      content: draft.content,
      qualityCheck,
    });
    setDraft(null);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  }

  function handleCopyDraft() {
    if (!draft) return;
    navigator.clipboard.writeText(draft.content).catch(() => {});
  }

  function handleOpenLetter(id: string) {
    setDraft(null);
    setActiveLetterId(id);
    setAutosaveStatus("idle");
  }

  function handleActiveLetterChange(id: string, content: string) {
    setAutosaveStatus("saving");
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      updateContent(id, content);
      setAutosaveStatus("saved");
    }, AUTOSAVE_DEBOUNCE_MS);
  }

  const activeLetter: CoverLetter | undefined = activeLetterId ? letters.find((l) => l.id === activeLetterId) : undefined;

  return (
    <div className="space-y-6">
      <CoverLetterGeneratorForm
        resumeVersions={resumeVersions}
        analyses={analyses}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
      />

      {error && (
        <div
          className="flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--cat-rejected)", backgroundColor: "var(--cat-rejected-bg)", color: "var(--cat-rejected)" }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </div>
      )}

      {savedFlash && (
        <div
          className="flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm"
          style={{ borderColor: "var(--cat-offer)", backgroundColor: "var(--cat-offer-bg)", color: "var(--cat-offer)" }}
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>Saved — find it below, or open it any time to keep editing.</span>
        </div>
      )}

      {draft && (
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="card-soft space-y-4 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                Draft — {draft.companyName} · {draft.jobRole}
              </p>
              <div className="flex gap-2">
                <button onClick={handleCopyDraft} className="btn-secondary-sm">
                  <Copy className="h-3.5 w-3.5" strokeWidth={2} />
                  Copy
                </button>
                <button onClick={handleSaveDraft} className="btn-primary-sm">
                  <Save className="h-3.5 w-3.5" strokeWidth={2} />
                  Save
                </button>
              </div>
            </div>
            <CoverLetterEditor
              key={`draft-${draft.resumeVersionId}-${draft.companyName}-${draft.jobRole}`}
              initialContent={draft.content}
              companyName={draft.companyName}
              jobRole={draft.jobRole}
              onContentChange={(content) => setDraft((prev) => (prev ? { ...prev, content } : prev))}
            />
          </div>
          <CoverLetterQualityBadge
            check={runLocalQualityChecks({
              content: draft.content,
              companyName: draft.companyName,
              jobRole: draft.jobRole,
              aiToneConsistent: draft.toneConsistent,
              aiGrammarCorrect: draft.grammarCorrect,
              aiNotes: draft.notes,
            })}
          />
        </div>
      )}

      {isGenerating && !draft && (
        <div className="card-soft flex items-center gap-2 p-4 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
          Writing your cover letter — tailoring it to this role using your resume...
        </div>
      )}

      {activeLetter && (
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="card-soft space-y-4 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">Editing — {activeLetter.label}</p>
              <div className="flex items-center gap-2 text-xs text-muted">
                {autosaveStatus === "saving" && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} /> Saving...
                  </>
                )}
                {autosaveStatus === "saved" && "Saved"}
                <button onClick={() => setActiveLetterId(null)} className="btn-secondary-sm">
                  Done
                </button>
              </div>
            </div>
            <CoverLetterEditor
              key={activeLetter.id}
              initialContent={activeLetter.content}
              companyName={activeLetter.companyName}
              jobRole={activeLetter.jobRole}
              onContentChange={(content) => handleActiveLetterChange(activeLetter.id, content)}
            />
          </div>
          <CoverLetterQualityBadge check={activeLetter.qualityCheck} />
        </div>
      )}

      <div className="card-soft p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">Cover letters</p>
        {letters.length === 0 ? (
          <p className="text-xs text-muted">
            No saved cover letters yet — generate one above and click Save to keep it here.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {letters.map((letter) => (
              <CoverLetterCard
                key={letter.id}
                letter={letter}
                onOpen={() => handleOpenLetter(letter.id)}
                onRename={(label) => renameLetter(letter.id, label)}
                onDuplicate={() => duplicateLetter(letter.id)}
                onDelete={() => {
                  remove(letter.id);
                  if (activeLetterId === letter.id) setActiveLetterId(null);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
