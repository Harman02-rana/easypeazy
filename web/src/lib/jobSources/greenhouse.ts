import type { CompanySource } from "../companyConfig";
import { detectBatchEligibility, detectEmploymentType } from "./parseTitle";
import type { NormalizedJob } from "./types";

interface GreenhouseJob {
  id: number;
  title: string;
  updated_at: string;
  absolute_url: string;
  location?: { name?: string };
}

interface GreenhouseResponse {
  jobs: GreenhouseJob[];
}

/** Public, unauthenticated board API — no API key needed. Same endpoint
 * every "who's hiring" aggregator side project uses. */
export async function fetchGreenhouseJobs(company: CompanySource): Promise<NormalizedJob[]> {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${company.boardToken}/jobs?content=true`,
    { signal: AbortSignal.timeout(10_000) }
  );

  if (!res.ok) {
    throw new Error(`Greenhouse responded ${res.status} for board "${company.boardToken}"`);
  }

  const data = (await res.json()) as GreenhouseResponse;

  return data.jobs.map((job) => ({
    id: `${company.id}:${job.id}`,
    company: company.name,
    companyId: company.id,
    role: job.title,
    location: job.location?.name ?? "Not specified",
    employmentType: detectEmploymentType(job.title),
    batchEligibility: detectBatchEligibility(job.title),
    applyLink: job.absolute_url,
    source: "Greenhouse",
    lastUpdated: job.updated_at ?? new Date().toISOString(),
  }));
}
