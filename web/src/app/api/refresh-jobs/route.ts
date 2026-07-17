import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { fetchAllJobs } from "@/lib/jobSources";

// Must run on the Node runtime (needs fs) and never be statically optimized
// — this does a live network fetch + file write on every hit, by design.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LIVE_JOBS_PATH = path.join(process.cwd(), "data", "liveJobs.json");

/**
 * Manual refresh endpoint — hit this locally (GET /api/refresh-jobs) to pull
 * fresh postings from every configured Greenhouse/Lever/Ashby source and
 * write them to data/liveJobs.json.
 *
 * Deliberately NOT wired to a cron/schedule: per the brief, background
 * scheduled updates are a "later" feature. This is the manual trigger that
 * scheduling would eventually call automatically — today a human (or this
 * being hit once during local dev) is that trigger.
 *
 * Note on Vercel: writing to the filesystem only persists on a normal Node
 * process (local `next dev`/`next start`). Serverless functions in
 * production have an ephemeral filesystem, so hitting this in production
 * would still return a valid response but the write wouldn't stick around —
 * exactly the gap the "Future Ready" Supabase note is meant to close later.
 */
export async function GET() {
  const { jobs, results } = await fetchAllJobs();

  const payload = {
    fetchedAt: new Date().toISOString(),
    jobs,
    results: results.map((r) => ({
      companyId: r.companyId,
      companyName: r.companyName,
      source: r.source,
      ok: r.ok,
      jobCount: r.jobs.length,
      error: r.error,
    })),
  };

  try {
    fs.mkdirSync(path.dirname(LIVE_JOBS_PATH), { recursive: true });
    fs.writeFileSync(LIVE_JOBS_PATH, JSON.stringify(payload, null, 2) + "\n");
  } catch (err) {
    // A failed write (e.g. read-only filesystem in production) shouldn't
    // hide the fetch results themselves from the caller.
    return NextResponse.json({
      ...payload,
      writeError: err instanceof Error ? err.message : "Could not write liveJobs.json",
    });
  }

  return NextResponse.json(payload);
}
