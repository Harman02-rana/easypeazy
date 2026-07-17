import type { ATSProvider } from "../companyConfig";

export type EmploymentType = "Internship" | "Full-Time" | "Unknown";

/** The one common shape every ATS adapter normalizes into. This is the only
 * shape anything downstream (dashboard, calendar, filters) needs to know
 * about — adding a new source means writing one more adapter that returns
 * this, nothing else changes. */
export interface NormalizedJob {
  /** Stable across re-fetches so dedupe/"already saved" checks work —
   * `${companyId}:${externalId}`. */
  id: string;
  company: string;
  companyId: string;
  role: string;
  location: string;
  employmentType: EmploymentType;
  /** Graduation year this posting targets, when it can be detected from the
   * title (e.g. "2027", "2026") — undefined when it can't be. */
  batchEligibility?: string;
  /** Rarely present in ATS data; left for sources (or manual entries) that
   * do provide it. */
  experienceRequired?: string;
  applyLink: string;
  /** ISO date, only when the source actually provides one — most ATS job
   * boards don't. */
  deadline?: string;
  source: ATSProvider;
  /** ISO datetime of this fetch, not the original posting date (most ATS
   * APIs do give a posting/update date too; adapters pass that through
   * where available). */
  lastUpdated: string;
}

export interface SourceFetchResult {
  companyId: string;
  companyName: string;
  source: ATSProvider;
  ok: boolean;
  jobs: NormalizedJob[];
  /** Present only when ok is false — kept short and human-readable since
   * this is what a "some sources failed" banner would show. */
  error?: string;
}
