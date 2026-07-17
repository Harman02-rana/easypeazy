/**
 * Storage abstraction for personal tracker data.
 *
 * Every read/write to persisted tracker data should go through this module
 * (or the hooks built on top of it in src/hooks), never through
 * `localStorage` directly. That keeps a single seam to swap in a real
 * backend (e.g. Supabase) later: implement `DataStore` against Supabase,
 * point `store` at it, and nothing above this layer has to change shape.
 */

export interface DataStore {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
}

const isBrowser = typeof window !== "undefined";

class LocalStorageStore implements DataStore {
  getItem<T>(key: string): T | null {
    if (!isBrowser) return null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or unavailable (private browsing etc.) — fail silently
      // rather than crash the app; the in-memory state still works for the
      // current session.
    }
  }

  removeItem(key: string): void {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

export const store: DataStore = new LocalStorageStore();

/** All keys the tracker persists — used by the backup export/import so
 * that adding a new tracker data type only means adding one line here. */
export const TRACKER_KEYS = {
  plannerEntries: "jhp_planner_entries",
  tasks: "jhp_tasks",
  monthlyGoals: "jhp_monthly_goals",
  studyTopics: "jhp_study_topics",
  milestones: "jhp_roadmap_milestones",
  applications: "jhp_applications",
} as const;

export function generateId(): string {
  if (isBrowser && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
