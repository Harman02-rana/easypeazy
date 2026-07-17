import Link from "next/link";
import HomeSearch from "@/components/HomeSearch";
import JobList from "@/components/JobList";
import PersonalDashboard from "@/components/PersonalDashboard";
import Greeting from "@/components/Greeting";
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
    <div>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        <span className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted">
          2027 Focus
        </span>

        <div className="mt-3">
          <Greeting />
        </div>

        <p className="mt-2 text-[15px] text-muted">
          Let&rsquo;s see what we&rsquo;re working on today.
        </p>
        <p className="mt-1 text-xs text-muted">
          Built with a little extra love by your sister ❤️
        </p>

        <div className="mt-6 max-w-xl">
          <HomeSearch />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.label} href={link.href} className="card-soft btn-tactile px-4 py-3 text-sm font-medium text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <PersonalDashboard />

      <div className="mx-auto max-w-6xl px-5 py-10">
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
