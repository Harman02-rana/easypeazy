import type { CompanySource } from "../companyConfig";
import { detectBatchEligibility, detectEmploymentType } from "./parseTitle";
import type { NormalizedJob } from "./types";

interface AshbyJob {
  id: string;
  title: string;
  location?: string;
  jobUrl?: string;
  applyUrl?: string;
  publishedAt?: string;
}

interface AshbyResponse {
  jobs: AshbyJob[];
}

/** Public, unauthenticated job-board API. */
export async function fetchAshbyJobs(company: CompanySource): Promise<NormalizedJob[]> {
  const res = await fetch(
    `https://api.ashbyhq.com/posting-api/job-board/${company.boardToken}`,
    { signal: AbortSignal.timeout(10_000) }
  );

  if (!res.ok) {
    throw new Error(`Ashby responded ${res.status} for board "${company.boardToken}"`);
  }

  const data = (await res.json()) as AshbyResponse;

  return (data.jobs ?? []).map((job) => ({
    id: `${company.id}:${job.id}`,
    company: company.name,
    companyId: company.id,
    role: job.title,
    location: job.location ?? "Not specified",
    employmentType: detectEmploymentType(job.title),
    batchEligibility: detectBatchEligibility(job.title),
    applyLink: job.applyUrl ?? job.jobUrl ?? company.careersUrl,
    source: "Ashby",
    lastUpdated: job.publishedAt ?? new Date().toISOString(),
  }));
}
