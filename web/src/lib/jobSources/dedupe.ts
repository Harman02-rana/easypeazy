import type { NormalizedJob } from "./types";

/** Jobs are already keyed `${companyId}:${externalId}` by each adapter, so
 * true duplicates only show up if a source gets fetched twice (e.g. listed
 * under two different board tokens by mistake) — keep the first occurrence,
 * which is also the one with the most complete data in practice. */
export function dedupeJobs(jobs: NormalizedJob[]): NormalizedJob[] {
  const seen = new Set<string>();
  const result: NormalizedJob[] = [];
  for (const job of jobs) {
    if (seen.has(job.id)) continue;
    seen.add(job.id);
    result.push(job);
  }
  return result;
}
