"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId, TRACKER_KEYS } from "@/lib/storage";
import { createStarterMilestones, createStarterStudyTopics } from "@/lib/starterData";
import type {
  Application,
  AtsAnalysisResult,
  CompanyNote,
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
 * never duplicated) plus any number of company/role-tailored optimized
 * copies. Capped like the ATS analyses list so localStorage doesn't grow
 * unbounded over a long placement season. */
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
          companyName: "",
          jobRole: "",
          content,
          changeSummary: [],
          sourceAnalysisId: null,
          createdAt: existingMaster?.createdAt ?? new Date().toISOString(),
          optimizedAt: new Date().toISOString(),
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
      const version: ResumeVersion = {
        id: generateId(),
        isMaster: false,
        createdAt: new Date().toISOString(),
        optimizedAt: new Date().toISOString(),
        ...input,
      };
      crud.setItems((prev) => [version, ...prev].slice(0, MAX_STORED_RESUME_VERSIONS));
    },
    [crud]
  );

  return { ...crud, saveMaster, saveVersion };
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
