import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCompanies,
  getCompanyBySlug,
  getJobsForCompany,
} from "@/lib/data";

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
    title: `${company.name} — Internships & New Grad Roles | Easypeazyy`,
    description: `Official careers, internship, and new-grad links for ${company.name}.`,
  };
}

function LinkCard({
  label,
  href,
  description,
}: {
  label: string;
  href: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-1 text-xs text-muted">{description}</p>
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          Visit page ↗
        </a>
      ) : (
        <span className="mt-4 inline-block text-sm text-muted/60">
          Not available
        </span>
      )}
    </div>
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

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/#companies"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
      >
        ← Back to all companies
      </Link>

      <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {company.name}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {company.category ? (
              company.category.split(",").map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted"
                >
                  {c.trim()}
                </span>
              ))
            ) : (
              <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted/60">
                Uncategorized
              </span>
            )}
          </div>
        </div>

        {company.officialCareers && (
          <a
            href={company.officialCareers}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full bg-linear-to-br from-accent to-accent-2 px-6 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Apply on official site
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 py-8 sm:grid-cols-4">
        <Stat label="Internship roles" value={internships.length} />
        <Stat label="New grad roles" value={newGrad.length} />
        <Stat label="Hiring season" value={company.hiringSeason || "N/A"} />
        <Stat
          label="Category"
          value={company.category ? company.category.split(",")[0].trim() : "N/A"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <LinkCard
          label="Official Careers"
          description="Main careers hub"
          href={company.officialCareers}
        />
        <LinkCard
          label="Internships"
          description="Student internship program"
          href={company.internships}
        />
        <LinkCard
          label="New Grad"
          description="University / early careers"
          href={company.newGrad}
        />
        <LinkCard
          label="Website"
          description="Company homepage"
          href={company.website}
        />
      </div>

      {jobs.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-semibold tracking-tight">
            Open roles in our listings
          </h2>
          <p className="mt-1 text-sm text-muted">
            Pulled from our tracked postings. Always confirm current openings
            on the official careers page above.
          </p>

          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-2 bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{job.position}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {job.location || "Location not specified"} ·{" "}
                    <span
                      className={
                        job.type === "Internship"
                          ? "text-accent-2"
                          : "text-accent"
                      }
                    >
                      {job.type}
                    </span>
                  </p>
                </div>
                {job.applyLink && (
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-nowrap rounded-full border border-border px-4 py-1.5 text-xs font-medium transition-colors hover:border-border-strong hover:bg-surface-hover"
                  >
                    Apply ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold">{value}</p>
    </div>
  );
}
