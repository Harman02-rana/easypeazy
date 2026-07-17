import Link from "next/link";
import type { Company } from "@/lib/types";

function LinkRow({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  if (!href) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="text-muted/50">Not available</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="font-medium text-foreground underline-offset-4 hover:text-accent hover:underline"
      >
        Visit ↗
      </a>
    </div>
  );
}

export default function CompanyCard({ company }: { company: Company }) {
  const totalRoles = company.openInternshipRoles + company.openNewGradRoles;

  return (
    <div className="card-glow group relative flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{company.name}</h3>
          {company.category ? (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {company.category.split(",").map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted"
                >
                  {c.trim()}
                </span>
              ))}
            </div>
          ) : (
            <span className="mt-1.5 inline-block rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted/60">
              Uncategorized
            </span>
          )}
        </div>
        {totalRoles > 0 && (
          <span className="whitespace-nowrap rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
            {totalRoles} open
          </span>
        )}
      </div>

      <div className="space-y-2 border-t border-border pt-4">
        <LinkRow label="Official Careers" href={company.officialCareers} />
        <LinkRow label="Internships" href={company.internships} />
        <LinkRow label="New Grad" href={company.newGrad} />
        <LinkRow label="Website" href={company.website} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Hiring Season</span>
          <span className="font-medium text-foreground">
            {company.hiringSeason || "Not available"}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-border pt-5">
        <Link
          href={`/companies/${company.slug}`}
          className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-medium transition-colors hover:border-border-strong hover:bg-surface-hover"
        >
          View details
        </Link>
        {company.officialCareers && (
          <a
            href={company.officialCareers}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full bg-linear-to-br from-accent to-accent-2 px-4 py-2 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Apply
          </a>
        )}
      </div>
    </div>
  );
}
