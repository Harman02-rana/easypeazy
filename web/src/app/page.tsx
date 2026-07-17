import Link from "next/link";
import HomeSearch from "@/components/HomeSearch";
import JobList from "@/components/JobList";
import { getJobs, getStats } from "@/lib/data";

const quickLinks = [
  { label: "New Grad Jobs", href: "/jobs?type=New+Grad" },
  { label: "Internships", href: "/internships" },
  { label: "Startup Jobs", href: "/resources#startup-jobs" },
  { label: "Government Opportunities", href: "/jobs?category=Government" },
];

export default function Home() {
  const stats = getStats();
  const recentJobs = [...getJobs()]
    .sort((a, b) => (b.datePosted || "").localeCompare(a.datePosted || ""))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <p className="text-sm text-muted">
        Built to make your 2027 job search a little easier.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Find your next opportunity.
        </h1>
        <span className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted">
          2027 Focus
        </span>
      </div>

      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
        A personal collection of internships, graduate roles, and useful
        job-hunting resources for the 2027 placement season.
      </p>

      <div className="mt-6 max-w-xl">
        <HomeSearch />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="row-hover rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Opportunities worth checking
          </h2>
          <Link
            href="/jobs"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            View all {stats.totalJobs} roles →
          </Link>
        </div>
        <p className="mt-1 text-sm text-muted">
          Curated for the 2027 season — always check eligibility on the
          official posting before applying.
        </p>

        <div className="mt-4">
          <JobList jobs={recentJobs} />
        </div>
      </div>
    </div>
  );
}
