import type { Metadata } from "next";
import IndiaExplorer from "@/components/IndiaExplorer";
import { getJobs } from "@/lib/data";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `India Opportunities — ${SITE_NAME}`,
};

export default function IndiaPage() {
  const indiaJobs = getJobs().filter((j) => j.locationBucket === "India");

  const categories = Array.from(
    new Set(
      indiaJobs.flatMap((j) => j.category.split(",").map((c) => c.trim()).filter(Boolean))
    )
  ).sort((a, b) => a.localeCompare(b));

  const companyNames = Array.from(new Set(indiaJobs.map((j) => j.company))).sort(
    (a, b) => a.localeCompare(b)
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">India Opportunities</h1>
      <p className="mt-1 text-sm text-muted">
        {indiaJobs.length} role{indiaJobs.length === 1 ? "" : "s"} based in India —
        no visa sponsorship needed, no relocation surprises. Just apply.
      </p>

      <div className="mt-6">
        <IndiaExplorer jobs={indiaJobs} categories={categories} companyNames={companyNames} />
      </div>
    </div>
  );
}
