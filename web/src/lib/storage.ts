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

/**
 * Cross-instance sync within the same tab. `useLocalStorage` uses plain
 * React state for speed, but that means two mounted components reading the
 * same key each get their own independent copy — a write in one wouldn't
 * otherwise be seen by the other until it happened to remount. Every write
 * publishes to this key; every hook instance for that key is subscribed and
 * re-reads from storage when notified. (Cross-tab sync would need the
 * browser's native `storage` event too, but that's out of scope for a
 * single-user, single-tab tracker.)
 */
const keyListeners = new Map<string, Set<() => void>>();

export function subscribeToKey(key: string, listener: () => void): () => void {
  if (!keyListeners.has(key)) keyListeners.set(key, new Set());
  keyListeners.get(key)!.add(listener);
  return () => {
    keyListeners.get(key)?.delete(listener);
  };
}

export function publishKeyChange(key: string): void {
  keyListeners.get(key)?.forEach((listener) => listener());
}

/** All keys the tracker persists — used by the backup export/import so
 * that adding a new tracker data type only means adding one line here. */
export const TRACKER_KEYS = {
  plannerEntries: "jhp_planner_entries",
  tasks: "jhp_tasks",
  littleWins: "jhp_little_wins",
  monthlyGoals: "jhp_monthly_goals",
  studyTopics: "jhp_study_topics",
  milestones: "jhp_roadmap_milestones",
  applications: "jhp_applications",
  applicationMilestoneState: "jhp_application_milestone_state",
  companyNotes: "jhp_company_notes",
  reminderDismissals: "jhp_reminder_dismissals",
  resume: "jhp_resume",
  atsAnalyses: "jhp_ats_analyses",
  resumeVersions: "jhp_resume_versions",
} as const;

export function generateId(): string {
  if (isBrowser && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
