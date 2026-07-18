"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId, TRACKER_KEYS } from "@/lib/storage";
import { createStarterMilestones, createStarterStudyTopics } from "@/lib/starterData";
import type {
  Application,
  AtsAnalysisResult,
  CompanyNote,
  CoverLetter,
  LittleWin,
  MonthlyGoal,
  NewApplicationInput,
  PlannerEntry,
  ResumeRecord,
  ResumeVersion,
  RoadmapMilestone,
  StudyTopic,
  Task,
} from "@/lib/trackerTypes";

const MAX_STORED_ATS_ANALYSES = 20;
const MAX_STORED_RESUME_VERSIONS = 30;
const MAX_STORED_COVER_LETTERS = 30;

interface WithId {
  id: string;
}

/** Shared CRUD shape for every list-backed tracker resource. Swapping the
 * underlying `useLocalStorage` call for an async Supabase-backed hook later
 * would keep this same `{ items, hydrated, add, update, remove }` surface,
 * so pages/components built against it wouldn't need to change. */
function useCrudList<T extends WithId>(key: string, initialValue: T[]) {
  const [items, setItems, hydrated] = useLocalStorage<T[]>(key, initialValue);

  const add = useCallback(
    (item: T) => {
      setItems((prev) => [item, ...prev]);
    },
    [setItems]
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      );
    },
    [setItems]
  );

  const remove = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setItems]
  );

  return { items, hydrated, add, update, remove, setItems };
}

// ---------------------------------------------------------------------------

export function usePlannerEntries() {
  return useCrudList<PlannerEntry>(TRACKER_KEYS.plannerEntries, []);
}

export function useTasks() {
  return useCrudList<Task>(TRACKER_KEYS.tasks, []);
}

export function useLittleWins() {
  return useCrudList<LittleWin>(TRACKER_KEYS.littleWins, []);
}

export function useMonthlyGoals() {
  return useCrudList<MonthlyGoal>(TRACKER_KEYS.monthlyGoals, []);
}

export function useStudyTopics() {
  return useCrudList<StudyTopic>(TRACKER_KEYS.studyTopics, createStarterStudyTopics());
}

export function useMilestones() {
  return useCrudList<RoadmapMilestone>(
    TRACKER_KEYS.milestones,
    createStarterMilestones()
  );
}

export function useApplications() {
  const crud = useCrudList<Application>(TRACKER_KEYS.applications, []);

  /** Adds a job as a "Saved" application unless the same company + role +
   * application link has already been saved. Returns whether it added a
   * new row (false means it was already there). */
  const saveFromJob = useCallback(
    (job: NewApplicationInput): boolean => {
      const exists = crud.items.some(
        (a) =>
          a.company.trim().toLowerCase() === job.company.trim().toLowerCase() &&
          a.role.trim().toLowerCase() === job.role.trim().toLowerCase() &&
          a.applicationLink.trim() === job.applicationLink.trim()
      );
      if (exists) return false;

      const today = new Date().toISOString().slice(0, 10);
      crud.add({
        id: generateId(),
        company: job.company,
        role: job.role,
        jobType: job.jobType,
        location: job.location,
        applicationLink: job.applicationLink,
        dateSaved: today,
        dateApplied: job.dateApplied ?? "",
        applicationDeadline: job.applicationDeadline ?? "",
        status: job.status ?? "Saved",
        oaDate: job.oaDate ?? "",
        oaPlatform: job.oaPlatform ?? "",
        oaResult: job.oaResult ?? "",
        interviewDate: job.interviewDate ?? "",
        interviewRound: job.interviewRound ?? "",
        interviewResult: job.interviewResult ?? "",
        resumeVersion: job.resumeVersion ?? "",
        followUpDate: job.followUpDate ?? "",
        notes: job.notes ?? "",
      });
      return true;
    },
    [crud]
  );

  const isSaved = useCallback(
    (company: string, role: string, applicationLink: string) =>
      crud.items.some(
        (a) =>
          a.company.trim().toLowerCase() === company.trim().toLowerCase() &&
          a.role.trim().toLowerCase() === role.trim().toLowerCase() &&
          a.applicationLink.trim() === applicationLink.trim()
      ),
    [crud.items]
  );

  return { ...crud, saveFromJob, isSaved };
}

/** One note per company (resume version, referral status, interview/OA
 * notes, important dates) — an upsert map rather than a CRUD list, since
 * there's only ever one record per company. */
export function useCompanyNotes() {
  const [notes, setNotes, hydrated] = useLocalStorage<Record<string, CompanyNote>>(
    TRACKER_KEYS.companyNotes,
    {}
  );

  const getNote = useCallback(
    (companyId: string): CompanyNote =>
      notes[companyId] ?? {
        companyId,
        resumeVersion: "",
        referralStatus: "",
        interviewNotes: "",
        oaNotes: "",
        importantDates: "",
        updatedAt: "",
      },
    [notes]
  );

  const saveNote = useCallback(
    (companyId: string, patch: Partial<Omit<CompanyNote, "companyId">>) => {
      setNotes((prev) => ({
        ...prev,
        [companyId]: {
          ...(prev[companyId] ?? {
            companyId,
            resumeVersion: "",
            referralStatus: "",
            interviewNotes: "",
            oaNotes: "",
            importantDates: "",
            updatedAt: "",
          }),
          ...patch,
          companyId,
          updatedAt: new Date().toISOString(),
        },
      }));
    },
    [setNotes]
  );

  return { notes, hydrated, getNote, saveNote };
}

/** The single uploaded resume record (or null if none uploaded yet) — not
 * a CRUD list, since there's only ever one active resume. */
export function useResume() {
  const [resume, setResume, hydrated] = useLocalStorage<ResumeRecord | null>(
    TRACKER_KEYS.resume,
    null
  );

  const clear = useCallback(() => setResume(null), [setResume]);

  return { resume, hydrated, setResume, clear };
}

/** Past ATS analyses, most recent first — capped so localStorage doesn't
 * grow unbounded across many job descriptions over time. */
export function useAtsAnalyses() {
  const crud = useCrudList<AtsAnalysisResult>(TRACKER_KEYS.atsAnalyses, []);

  const add = useCallback(
    (result: AtsAnalysisResult) => {
      crud.setItems((prev) => [result, ...prev].slice(0, MAX_STORED_ATS_ANALYSES));
    },
    [crud]
  );

  return { ...crud, add };
}

/** Saved resume versions — one canonical Master Resume (re-saved in place,
 * automatically kept in sync with Resume Studio's active upload, never
 * duplicated) plus any number of company/role-tailored optimized copies.
 * Capped like the ATS analyses list so localStorage doesn't grow unbounded
 * over a long placement season. */
export function useResumeVersions() {
  const crud = useCrudList<ResumeVersion>(TRACKER_KEYS.resumeVersions, []);

  const saveMaster = useCallback(
    (content: string) => {
      crud.setItems((prev) => {
        const existingMaster = prev.find((v) => v.isMaster);
        const master: ResumeVersion = {
          id: existingMaster?.id ?? generateId(),
          label: "Master Resume",
          isMaster: true,
          versionNumber: 0,
          companyName: "",
          jobRole: "",
          content,
          templateId: existingMaster?.templateId ?? "classic",
          changeSummary: [],
          sourceAnalysisId: null,
          createdAt: existingMaster?.createdAt ?? new Date().toISOString(),
          lastModifiedAt: new Date().toISOString(),
        };
        return [master, ...prev.filter((v) => !v.isMaster)];
      });
    },
    [crud]
  );

  const saveVersion = useCallback(
    (input: {
      label: string;
      companyName: string;
      jobRole: string;
      content: string;
      changeSummary: string[];
      sourceAnalysisId: string | null;
    }) => {
      crud.setItems((prev) => {
        const highestVersion = prev.reduce((max, v) => Math.max(max, v.versionNumber), 0);
        const version: ResumeVersion = {
          id: generateId(),
          isMaster: false,
          versionNumber: highestVersion + 1,
          templateId: "classic",
          createdAt: new Date().toISOString(),
          lastModifiedAt: new Date().toISOString(),
          ...input,
        };
        return [version, ...prev].slice(0, MAX_STORED_RESUME_VERSIONS);
      });
    },
    [crud]
  );

  const renameVersion = useCallback(
    (id: string, label: string) => {
      crud.update(id, { label, lastModifiedAt: new Date().toISOString() });
    },
    [crud]
  );

  const setTemplate = useCallback(
    (id: string, templateId: ResumeVersion["templateId"]) => {
      crud.update(id, { templateId, lastModifiedAt: new Date().toISOString() });
    },
    [crud]
  );

  const duplicateVersion = useCallback(
    (id: string) => {
      crud.setItems((prev) => {
        const source = prev.find((v) => v.id === id);
        if (!source) return prev;
        const highestVersion = prev.reduce((max, v) => Math.max(max, v.versionNumber), 0);
        const now = new Date().toISOString();
        const copy: ResumeVersion = {
          ...source,
          id: generateId(),
          isMaster: false,
          versionNumber: highestVersion + 1,
          label: `${source.label} (Copy)`,
          createdAt: now,
          lastModifiedAt: now,
        };
        return [copy, ...prev].slice(0, MAX_STORED_RESUME_VERSIONS);
      });
    },
    [crud]
  );

  return { ...crud, saveMaster, saveVersion, renameVersion, setTemplate, duplicateVersion };
}

/** Saved cover letters — a flat list like resume versions, capped the
 * same way. No "master" concept here since every cover letter is already
 * company/role-specific by nature. */
export function useCoverLetters() {
  const crud = useCrudList<CoverLetter>(TRACKER_KEYS.coverLetters, []);

  const saveNew = useCallback(
    (input: Omit<CoverLetter, "id" | "createdAt" | "lastModifiedAt">) => {
      const now = new Date().toISOString();
      const letter: CoverLetter = { id: generateId(), createdAt: now, lastModifiedAt: now, ...input };
      crud.setItems((prev) => [letter, ...prev].slice(0, MAX_STORED_COVER_LETTERS));
      return letter;
    },
    [crud]
  );

  const renameLetter = useCallback(
    (id: string, label: string) => {
      crud.update(id, { label, lastModifiedAt: new Date().toISOString() });
    },
    [crud]
  );

  const updateContent = useCallback(
    (id: string, content: string) => {
      crud.update(id, { content, lastModifiedAt: new Date().toISOString() });
    },
    [crud]
  );

  const duplicateLetter = useCallback(
    (id: string) => {
      crud.setItems((prev) => {
        const source = prev.find((l) => l.id === id);
        if (!source) return prev;
        const now = new Date().toISOString();
        const copy: CoverLetter = { ...source, id: generateId(), label: `${source.label} (Copy)`, createdAt: now, lastModifiedAt: now };
        return [copy, ...prev].slice(0, MAX_STORED_COVER_LETTERS);
      });
    },
    [crud]
  );

  return { ...crud, saveNew, renameLetter, updateContent, duplicateLetter };
}

/** Dismissed hiring-reminder ids — a plain string set, persisted so a
 * dismissed reminder ("Microsoft opens in 20 days") doesn't reappear on the
 * next visit within the same window it was generated for. */
export function useReminderDismissals() {
  const [dismissed, setDismissed, hydrated] = useLocalStorage<string[]>(
    TRACKER_KEYS.reminderDismissals,
    []
  );

  const dismiss = useCallback(
    (reminderId: string) => {
      setDismissed((prev) => (prev.includes(reminderId) ? prev : [...prev, reminderId]));
    },
    [setDismissed]
  );

  const isDismissed = useCallback(
    (reminderId: string) => dismissed.includes(reminderId),
    [dismissed]
  );

  return { dismissed, hydrated, dismiss, isDismissed };
}
