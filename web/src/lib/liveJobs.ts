import liveJobsData from "../../data/liveJobs.json";
import type { NormalizedJob, SourceFetchResult } from "./jobSources/types";

interface LiveJobsFile {
  fetchedAt: string | null;
  jobs: NormalizedJob[];
  results: Array<Pick<SourceFetchResult, "companyId" | "companyName" | "source" | "ok" | "error"> & {
    jobCount: number;
  }>;
}

const data = liveJobsData as LiveJobsFile;

/** Deliberately separate from lib/data.ts's getJobs() — this reads the
 * live-fetched dataset (data/liveJobs.json, produced by GET
 * /api/refresh-jobs), not the curated static one that the existing
 * Jobs/Internships/India/Companies pages already depend on. Nothing here
 * touches that file or its readers. */
export function getLiveJobs(): NormalizedJob[] {
  return data.jobs;
}

export function getLastFetchedAt(): string | null {
  return data.fetchedAt;
}

export function getLastFetchResults() {
  return data.results;
}
