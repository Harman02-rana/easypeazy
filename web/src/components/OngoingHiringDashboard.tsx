"use client";

import { useMemo, useState } from "react";
import {
  Bookmark,
  CalendarClock,
  CheckCircle2,
  Flame,
  Sparkles,
  Target,
} from "lucide-react";
import { useApplications } from "@/hooks/useTracker";
import { computeUpcomingEvents } from "@/lib/applicationUtils";
import { COMPANY_SOURCES } from "@/lib/companyConfig";
import { buildHiringCalendar } from "@/lib/hiringCalendar";
import {
  detectTechCategory,
  TECH_CATEGORIES,
} from "@/lib/jobSources/parseTitle";
import type { NormalizedJob } from "@/lib/jobSources/types";
import { isNewToday, liveJobLocationBucket } from "@/lib/ongoingHiring";
import type { Application } from "@/lib/trackerTypes";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import EmptyState from "./EmptyState";
import LiveJobCard from "./LiveJobCard";

function buildRecommendations(jobs: NormalizedJob[], applications: Application[]): NormalizedJob[] {
  const appliedCompanyNames = new Set(applications.map((a) => a.company.trim().toLowerCase()));
  const interestedCategories = new Set(
    applications
      .map((a) => COMPANY_SOURCES.find((c) => c.name.toLowerCase() === a.company.trim().toLowerCase())?.category)
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
  );

  const pool = jobs.filter((j) => !appliedCompanyNames.has(j.company.trim().toLowerCase()));

  if (interestedCategories.size > 0) {
    const matched = pool.filter((j) => {
      const source = COMPANY_SOURCES.find((c) => c.id === j.companyId);
      return source && interestedCategories.has(source.category);
    });
    if (matched.length > 0) return matched.slice(0, 6);
  }

  const seenCompanies = new Set<string>();
  const sample: NormalizedJob[] = [];
  for (const job of pool) {
    if (seenCompanies.has(job.companyId)) continue;
    seenCompanies.add(job.companyId);
    sample.push(job);
    if (sample.length >= 6) break;
  }
  return sample;
}

function SectionHeading({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
      {icon}
      {label}
      <span className="font-normal text-muted">({count})</span>
    </h2>
  );
}

export default function OngoingHiringDashboard({ liveJobs }: { liveJobs: NormalizedJob[] }) {
  const { items: applications, hydrated } = useApplications();

  const [query, setQuery] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [techCategory, setTechCategory] = useState("");
  const [sector, setSector] = useState("");
  const [locationBucket, setLocationBucket] = useState("");

  const newToday = useMemo(() => liveJobs.filter((j) => isNewToday(j)), [liveJobs]);

  const hiringSoon = useMemo(
    () => buildHiringCalendar().filter((g) => !g.isCurrentMonth && g.daysUntilStart <= 30),
    []
  );

  const deadlinesThisWeek = useMemo(() => {
    if (!hydrated) return [];
    return computeUpcomingEvents(applications).filter((e) => {
      if (e.type !== "Deadline") return false;
      const days = Math.round(
        (new Date(e.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return days <= 7;
    });
  }, [applications, hydrated]);

  const savedJobs = useMemo(
    () => (hydrated ? applications.filter((a) => a.status === "Saved") : []),
    [applications, hydrated]
  );
  const appliedJobs = useMemo(
    () => (hydrated ? applications.filter((a) => a.status !== "Saved") : []),
    [applications, hydrated]
  );

  const recommended = useMemo(
    () => (hydrated ? buildRecommendations(liveJobs, applications) : []),
    [liveJobs, applications, hydrated]
  );

  const companyNames = useMemo(
    () => Array.from(new Set(liveJobs.map((j) => j.company))).sort((a, b) => a.localeCompare(b)),
    [liveJobs]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return liveJobs.filter((job) => {
      const matchesQuery =
        !q ||
        job.company.toLowerCase().includes(q) ||
        job.role.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);
      const matchesBatch = !batchYear || job.batchEligibility === batchYear;
      const matchesEmployment = !employmentType || job.employmentType === employmentType;
      const matchesTech = !techCategory || detectTechCategory(job.role) === techCategory;
      const matchesLocation = !locationBucket || liveJobLocationBucket(job.location) === locationBucket;
      const matchesSector =
        !sector ||
        (() => {
          const source = COMPANY_SOURCES.find((c) => c.id === job.companyId);
          const isGovt = source?.category === "Government Organizations";
          return sector === "Government" ? isGovt : !isGovt;
        })();
      return matchesQuery && matchesBatch && matchesEmployment && matchesTech && matchesLocation && matchesSector;
    });
  }, [liveJobs, query, batchYear, employmentType, techCategory, sector, locationBucket]);

  return (
    <div>
      {/* Quick overview strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="card-soft p-3">
          <p className="text-lg font-semibold text-foreground">{newToday.length}</p>
          <p className="text-xs text-muted">🔥 New today</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-lg font-semibold text-foreground">{liveJobs.length}</p>
          <p className="text-xs text-muted">🟢 Ongoing hiring</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-lg font-semibold text-foreground">{deadlinesThisWeek.length}</p>
          <p className="text-xs text-muted">⏰ Deadlines this week</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-lg font-semibold text-foreground">{hiringSoon.length}</p>
          <p className="text-xs text-muted">📅 Hiring soon</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-lg font-semibold text-foreground">{savedJobs.length}</p>
          <p className="text-xs text-muted">❤️ Saved</p>
        </div>
        <div className="card-soft p-3">
          <p className="text-lg font-semibold text-foreground">{appliedJobs.length}</p>
          <p className="text-xs text-muted">✅ Applied</p>
        </div>
      </div>

      {/* Deadlines this week */}
      {deadlinesThisWeek.length > 0 && (
        <div className="mt-8">
          <SectionHeading
            icon={<CalendarClock className="h-4 w-4" style={{ color: "var(--cat-rejected)" }} strokeWidth={2} />}
            label="Deadlines this week"
            count={deadlinesThisWeek.length}
          />
          <div className="list-soft mt-2">
            {deadlinesThisWeek.map((e) => (
              <div key={e.id} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">{e.company} — {e.role}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-muted">{e.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hiring soon */}
      {hiringSoon.length > 0 && (
        <div className="mt-8">
          <SectionHeading
            icon={<Sparkles className="h-4 w-4" style={{ color: "var(--cat-planner)" }} strokeWidth={2} />}
            label="Hiring soon"
            count={hiringSoon.reduce((n, g) => n + g.companies.length, 0)}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {hiringSoon.flatMap((g) =>
              g.companies.map((c) => (
                <span key={`${g.month}-${c.id}`} className="badge border border-border text-muted">
                  {c.name} · {g.month}
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="mt-8">
          <SectionHeading
            icon={<Target className="h-4 w-4" style={{ color: "var(--cat-sister)" }} strokeWidth={2} />}
            label="Recommended for you"
            count={recommended.length}
          />
          <div className="list-soft mt-2">
            {recommended.map((job) => (
              <LiveJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* New today */}
      {newToday.length > 0 && (
        <div className="mt-8">
          <SectionHeading
            icon={<Flame className="h-4 w-4" style={{ color: "var(--cat-interview)" }} strokeWidth={2} />}
            label="New today"
            count={newToday.length}
          />
          <div className="list-soft mt-2">
            {newToday.slice(0, 10).map((job) => (
              <LiveJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* Saved / Applied quick lists */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <SectionHeading
            icon={<Bookmark className="h-4 w-4" style={{ color: "var(--muted)" }} strokeWidth={2} />}
            label="Saved jobs"
            count={savedJobs.length}
          />
          {savedJobs.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Nothing saved yet.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {savedJobs.slice(0, 6).map((a) => (
                <li key={a.id} className="text-sm text-foreground">
                  {a.company} <span className="text-muted">· {a.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <SectionHeading
            icon={<CheckCircle2 className="h-4 w-4" style={{ color: "var(--cat-offer)" }} strokeWidth={2} />}
            label="Applied jobs"
            count={appliedJobs.length}
          />
          {appliedJobs.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Nothing applied yet.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {appliedJobs.slice(0, 6).map((a) => (
                <li key={a.id} className="text-sm text-foreground">
                  {a.company} <span className="text-muted">· {a.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Main ongoing hiring explorer */}
      <div className="mt-10">
        <h2 className="text-base font-semibold tracking-tight text-foreground">All ongoing hiring</h2>
        <div className="mt-3">
          <SearchBar value={query} onChange={setQuery} placeholder="Search companies, roles, or locations..." large />
        </div>
        <div className="mt-4">
          <FilterBar
            groups={[
              {
                label: "Batch",
                value: batchYear,
                onChange: setBatchYear,
                options: [
                  { label: "2026", value: "2026" },
                  { label: "2027", value: "2027" },
                ],
              },
              {
                label: "Type",
                value: employmentType,
                onChange: setEmploymentType,
                options: [
                  { label: "Internship", value: "Internship" },
                  { label: "Full-Time", value: "Full-Time" },
                ],
              },
              {
                label: "Category",
                value: techCategory,
                onChange: setTechCategory,
                options: TECH_CATEGORIES.map((c) => ({ label: c, value: c })),
              },
              {
                label: "Sector",
                value: sector,
                onChange: setSector,
                options: [
                  { label: "Government", value: "Government" },
                  { label: "Private", value: "Private" },
                ],
              },
              {
                label: "Location",
                value: locationBucket,
                onChange: setLocationBucket,
                options: [
                  { label: "India", value: "India" },
                  { label: "UAE", value: "UAE" },
                  { label: "Remote", value: "Remote" },
                  { label: "Other", value: "Other" },
                ],
              },
            ]}
            onClear={() => {
              setBatchYear("");
              setEmploymentType("");
              setTechCategory("");
              setSector("");
              setLocationBucket("");
            }}
          />
        </div>

        <p className="mt-4 text-sm font-medium text-foreground">
          {filtered.length} of {companyNames.length} companies&rsquo; open roles found
        </p>

        <div className="mt-3">
          {filtered.length === 0 ? (
            <EmptyState
              title="No roles match your filters right now"
              description="Try clearing a filter — or check back after the next refresh. 🌱"
            />
          ) : (
            <div className="list-soft">
              {filtered.slice(0, 100).map((job) => (
                <LiveJobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
