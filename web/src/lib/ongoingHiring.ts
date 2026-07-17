import { getLiveJobs } from "./liveJobs";
import { isRelevantEngineeringRole } from "./jobSources/parseTitle";
import type { NormalizedJob } from "./jobSources/types";

export type LiveLocationBucket = "India" | "UAE" | "Remote" | "Other";

export function liveJobLocationBucket(location: string): LiveLocationBucket {
  const l = location.toLowerCase();
  if (l.includes("remote")) return "Remote";
  if (l.includes("india") || /\b(bengaluru|bangalore|hyderabad|mumbai|pune|gurugram|gurgaon|chennai|noida|delhi)\b/.test(l)) {
    return "India";
  }
  if (l.includes("uae") || l.includes("dubai") || l.includes("abu dhabi")) return "UAE";
  return "Other";
}

/** The relevant-to-software-engineering subset of everything fetched —
 * this is what every dashboard section reads from, so "New Today",
 * "Ongoing Hiring", etc. never show an unrelated Sales/Marketing posting
 * just because it happened to be on the same company's board. */
export function getOngoingHiringJobs(): NormalizedJob[] {
  return getLiveJobs().filter((j) => isRelevantEngineeringRole(j.role));
}

export function isNewToday(job: NormalizedJob, referenceDate: Date = new Date()): boolean {
  const jobDate = job.lastUpdated.slice(0, 10);
  const today = referenceDate.toISOString().slice(0, 10);
  return jobDate === today;
}
