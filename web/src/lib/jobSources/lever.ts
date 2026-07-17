import type { CompanySource } from "../companyConfig";
import { detectBatchEligibility, detectEmploymentType } from "./parseTitle";
import type { NormalizedJob } from "./types";

interface LeverPosting {
  id: string;
  text: string;
  createdAt: number; // epoch ms
  hostedUrl: string;
  categories?: { location?: string };
}

/** Public, unauthenticated postings API. */
export async function fetchLeverJobs(company: CompanySource): Promise<NormalizedJob[]> {
  const res = await fetch(
    `https://api.lever.co/v0/postings/${company.boardToken}?mode=json`,
    { signal: AbortSignal.timeout(10_000) }
  );

  if (!res.ok) {
    throw new Error(`Lever responded ${res.status} for board "${company.boardToken}"`);
  }

  const data = (await res.json()) as LeverPosting[];

  return data.map((job) => ({
    id: `${company.id}:${job.id}`,
    company: company.name,
    companyId: company.id,
    role: job.text,
    location: job.categories?.location ?? "Not specified",
    employmentType: detectEmploymentType(job.text),
    batchEligibility: detectBatchEligibility(job.text),
    applyLink: job.hostedUrl,
    source: "Lever",
    lastUpdated: job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString(),
  }));
}
