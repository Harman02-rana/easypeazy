import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Company } from "@/lib/types";
import CompanyAvatar from "./CompanyAvatar";

export default function CompanyCard({ company }: { company: Company }) {
  const totalRoles = company.openInternshipRoles + company.openNewGradRoles;

  return (
    <div className="row-hover flex flex-col gap-2 border-b border-border px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <Link href={`/companies/${company.slug}`} className="flex min-w-0 items-center gap-3">
        <CompanyAvatar name={company.name} size="sm" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground hover:text-accent">
              {company.name}
            </span>
            {company.category && (
              <span className="badge border border-border text-muted">
                {company.category.split(",")[0].trim()}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {totalRoles} open role{totalRoles === 1 ? "" : "s"}
          </p>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-2">
        {company.officialCareers && (
          <a
            href={company.officialCareers}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-sm"
          >
            Careers
            <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} />
          </a>
        )}
        {company.internships && (
          <a
            href={company.internships}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-sm"
          >
            Internships
            <ArrowUpRight className="h-3 w-3" strokeWidth={2.25} />
          </a>
        )}
      </div>
    </div>
  );
}
