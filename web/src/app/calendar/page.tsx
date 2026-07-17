import type { Metadata } from "next";
import { CalendarDays, Clock } from "lucide-react";
import { buildHiringCalendar, rollingCompanies } from "@/lib/hiringCalendar";
import { categoryTint } from "@/lib/companyConfig";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `Hiring Calendar — ${SITE_NAME}`,
};

function countdownLabel(daysUntilStart: number, isCurrentMonth: boolean): string {
  if (isCurrentMonth) return "Open now";
  if (daysUntilStart <= 0) return "Open now";
  if (daysUntilStart <= 30) return `In ${daysUntilStart} day${daysUntilStart === 1 ? "" : "s"}`;
  const months = Math.round(daysUntilStart / 30);
  return `In ~${months} month${months === 1 ? "" : "s"}`;
}

export default function CalendarPage() {
  const groups = buildHiringCalendar();
  const rolling = rollingCompanies();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <CalendarDays className="h-6 w-6 text-muted" strokeWidth={2} />
        Hiring Calendar
      </h1>
      <p className="mt-1 text-sm text-muted">
        When companies have historically opened hiring — so you know what to prepare
        for, and when.
      </p>

      <div className="mt-8 space-y-4">
        {groups.map((group) => (
          <div key={group.month} className="card-soft p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                {group.month}
              </h2>
              <span
                className="pill flex items-center gap-1"
                style={
                  group.isCurrentMonth
                    ? { backgroundColor: "var(--cat-offer-bg)", color: "var(--cat-offer)" }
                    : { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" }
                }
              >
                <Clock className="h-3 w-3" strokeWidth={2.5} />
                {countdownLabel(group.daysUntilStart, group.isCurrentMonth)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {group.companies.map((company) => {
                const tint = categoryTint(company.category);
                return (
                  <a
                    key={company.id}
                    href={company.careersUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge border transition-colors hover:border-border-strong"
                    style={{ backgroundColor: tint.bg, color: tint.text, borderColor: "transparent" }}
                  >
                    {company.name}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {rolling.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-muted">Rolling — always worth checking</h2>
          <p className="mt-1 text-sm text-muted">
            No fixed season — these companies hire year-round, so there&rsquo;s no wrong
            time to apply.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {rolling.map((company) => {
              const tint = categoryTint(company.category);
              return (
                <a
                  key={company.id}
                  href={company.careersUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge border transition-colors hover:border-border-strong"
                  style={{ backgroundColor: tint.bg, color: tint.text, borderColor: "transparent" }}
                >
                  {company.name}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
