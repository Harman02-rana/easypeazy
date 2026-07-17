import { fetchableCompanySources } from "../companyConfig";
import { fetchAshbyJobs } from "./ashby";
import { dedupeJobs } from "./dedupe";
import { fetchGreenhouseJobs } from "./greenhouse";
import { fetchLeverJobs } from "./lever";
import type { NormalizedJob, SourceFetchResult } from "./types";

export type { NormalizedJob, SourceFetchResult } from "./types";

/** Fetches every configured, fetchable company source in parallel. Each
 * source is isolated with its own try/catch (via Promise.allSettled) so one
 * dead board token or a single provider outage never takes the rest down —
 * the caller always gets back a result per source, `ok: false` ones simply
 * contributed zero jobs. */
export async function fetchAllJobs(): Promise<{
  jobs: NormalizedJob[];
  results: SourceFetchResult[];
}> {
  const sources = fetchableCompanySources();

  const settled = await Promise.allSettled(
    sources.map(async (company): Promise<SourceFetchResult> => {
      try {
        let jobs: NormalizedJob[];
        switch (company.atsProvider) {
          case "Greenhouse":
            jobs = await fetchGreenhouseJobs(company);
            break;
          case "Lever":
            jobs = await fetchLeverJobs(company);
            break;
          case "Ashby":
            jobs = await fetchAshbyJobs(company);
            break;
          default:
            // Workday/Direct sources have no adapter yet — not an error,
            // just nothing to fetch automatically for them today.
            jobs = [];
        }
        return { companyId: company.id, companyName: company.name, source: company.atsProvider, ok: true, jobs };
      } catch (err) {
        return {
          companyId: company.id,
          companyName: company.name,
          source: company.atsProvider,
          ok: false,
          jobs: [],
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    })
  );

  const results = settled.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : {
          companyId: "unknown",
          companyName: "unknown",
          source: "Direct" as const,
          ok: false,
          jobs: [],
          error: "Fetch task itself rejected unexpectedly",
        }
  );

  const jobs = dedupeJobs(results.flatMap((r) => r.jobs));

  return { jobs, results };
}
