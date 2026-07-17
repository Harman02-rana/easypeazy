import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JobList from "@/components/JobList";
import CompanyNotes from "@/components/CompanyNotes";
import {
  getCompanies,
  getCompanyBySlug,
  getJobsForCompany,
} from "@/lib/data";
import { SITE_NAME } from "@/lib/personalConfig";

export function generateStaticParams() {
  return getCompanies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return {};
  return {
    title: `${company.name} — ${SITE_NAME}`,
    description: `Careers, internship, and new-grad links for ${company.name}.`,
  };
}

function LinkRow({ label, href }: { label: string; href: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="row-hover flex items-center justify-between border-b border-border px-4 py-3 text-sm last:border-b-0"
    >
      <span className="text-foreground">{label}</span>
      <span className="text-muted">Visit ↗</span>
    </a>
  );
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const jobs = getJobsForCompany(slug);
  const internships = jobs.filter((j) => j.type === "Internship");
  const newGrad = jobs.filter((j) => j.type === "New Grad");
  const hasLinks = company.officialCareers || company.internships || company.newGrad || company.website;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link
        href="/companies"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        ← Back to companies
      </Link>

      <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {company.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
            {company.category ? (
              company.category.split(",").map((c) => (
                <span
                  key={c}
                  className="rounded-md border border-border px-2 py-0.5 text-xs"
                >
                  {c.trim()}
                </span>
              ))
            ) : (
              <span>Uncategorized</span>
            )}
            <span>·</span>
            <span>
              {jobs.length} open role{jobs.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {company.officialCareers && (
          <a
            href={company.officialCareers}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tactile whitespace-nowrap rounded-lg bg-accent px-4 py-2 text-center text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Apply on official site
          </a>
        )}
      </div>

      {hasLinks && (
        <div className="list-soft mt-6">
          <LinkRow label="Official Careers" href={company.officialCareers} />
          <LinkRow label="Internships" href={company.internships} />
          <LinkRow label="New Grad" href={company.newGrad} />
          <LinkRow label="Website" href={company.website} />
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-base font-semibold tracking-tight">
          Open roles in our listings
        </h2>
        <p className="mt-1 text-sm text-muted">
          {internships.length} internship · {newGrad.length} new grad.
          Always confirm current openings on the official careers page above.
        </p>

        <div className="mt-4">
          <JobList jobs={jobs} />
        </div>
      </div>

      <div className="mt-10">
        <CompanyNotes companySlug={slug} companyName={company.name} />
      </div>
    </div>
  );
}
