import type { Metadata } from "next";
import InternshipsExplorer from "@/components/InternshipsExplorer";
import { getJobs } from "@/lib/data";
import type { LocationBucket } from "@/lib/types";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `Internships — ${SITE_NAME}`,
};

export default function InternshipsPage() {
  const internships = getJobs().filter((j) => j.type === "Internship");

  const bucketOrder: LocationBucket[] = ["India", "International", "Remote"];
  const presentBuckets = new Set(internships.map((j) => j.locationBucket));
  const locationBuckets = bucketOrder.filter((b) => presentBuckets.has(b));

  const companyNames = Array.from(
    new Set(internships.map((j) => j.company))
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Internships</h1>
      <p className="mt-1 text-sm text-muted">
        {internships.length} internship roles from companies actively
        hiring interns.
      </p>

      <div className="mt-6">
        <InternshipsExplorer
          internships={internships}
          locationBuckets={locationBuckets}
          companyNames={companyNames}
        />
      </div>
    </div>
  );
}
