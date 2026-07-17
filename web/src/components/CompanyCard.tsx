import Link from "next/link";
import type { Company } from "@/lib/types";

export default function CompanyCard({ company }: { company: Company }) {
  const totalRoles = company.openInternshipRoles + company.openNewGradRoles;

  return (
    <div className="row-hover flex flex-col gap-2 border-b border-border px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <Link href={`/companies/${company.slug}`} className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-foreground hover:text-accent">
            {company.name}
          </span>
          {company.category && (
            <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted">
              {company.category.split(",")[0].trim()}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted">
          {totalRoles} open role{totalRoles === 1 ? "" : "s"}
        </p>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        {company.officialCareers && (
          <a
            href={company.officialCareers}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface-hover"
          >
            Careers
          </a>
        )}
        {company.internships && (
          <a
            href={company.internships}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface-hover"
          >
            Internships
          </a>
        )}
      </div>
    </div>
  );
}
