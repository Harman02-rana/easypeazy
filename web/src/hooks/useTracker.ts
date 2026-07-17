"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { generateId, TRACKER_KEYS } from "@/lib/storage";
import { createStarterMilestones, createStarterStudyTopics } from "@/lib/starterData";
import type {
  Application,
  CompanyNote,
  LittleWin,
  MonthlyGoal,
  NewApplicationInput,
  PlannerEntry,
  RoadmapMilestone,
  StudyTopic,
  Task,
} from "@/lib/trackerTypes";

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
