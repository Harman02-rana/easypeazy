import type { Metadata } from "next";
import JobsExplorer from "@/components/JobsExplorer";
import {
  getJobs,
  getCategories,
  getLocationBuckets,
  getCompanyNamesWithJobs,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Jobs — JobHunter Pro",
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
      <p className="mt-1 text-sm text-muted">
        New grad and internship software roles, searchable and filterable.
      </p>

      <div className="mt-6">
        <JobsExplorer
          jobs={getJobs()}
          categories={getCategories()}
          locationBuckets={getLocationBuckets()}
          companyNames={getCompanyNamesWithJobs()}
          initialQuery={firstParam(params.q)}
          initialType={firstParam(params.type)}
          initialCategory={firstParam(params.category)}
        />
      </div>
    </div>
  );
}
