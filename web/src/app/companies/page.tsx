import type { Metadata } from "next";
import CompaniesExplorer from "@/components/CompaniesExplorer";
import { getCompanies } from "@/lib/data";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `Companies — ${SITE_NAME}`,
};

export default function CompaniesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Companies</h1>
      <p className="mt-1 text-sm text-muted">
        Every company with a tracked opening, with official links where
        we&rsquo;ve verified them.
      </p>

      <div className="mt-6">
        <CompaniesExplorer companies={getCompanies()} />
      </div>
    </div>
  );
}
