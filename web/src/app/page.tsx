import Link from "next/link";
import { Briefcase, GraduationCap, Landmark, Rocket } from "lucide-react";
import HomeSearch from "@/components/HomeSearch";
import PersonalDashboard from "@/components/PersonalDashboard";
import Greeting from "@/components/Greeting";
import { getJobs } from "@/lib/data";

const quickLinks = [
  {
    label: "New Grad Jobs",
    href: "/jobs?type=New+Grad",
    icon: Briefcase,
    text: "var(--cat-applications)",
    bg: "var(--cat-applications-bg)",
  },
  {
    label: "Internships",
    href: "/internships",
    icon: GraduationCap,
    text: "var(--cat-study)",
    bg: "var(--cat-study-bg)",
  },
  {
    label: "Startup Jobs",
    href: "/resources#startup-jobs",
    icon: Rocket,
    text: "var(--cat-interview)",
    bg: "var(--cat-interview-bg)",
  },
  {
    label: "Government Opportunities",
    href: "/jobs?category=Government",
    icon: Landmark,
    text: "var(--cat-offer)",
    bg: "var(--cat-offer-bg)",
  },
];

export default function Home() {
  const recentJobs = [...getJobs()]
    .sort((a, b) => (b.datePosted || "").localeCompare(a.datePosted || ""))
    .slice(0, 5);

  return (
    <div>
      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        <span className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted">
          2027 Focus
        </span>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <Greeting />
          <p className="text-sm italic text-muted">
            One step at a time. You&rsquo;re doing just fine.
          </p>
        </div>

        <p className="mt-2 text-[15px] text-muted">
          Here&rsquo;s what&rsquo;s happening with your placement journey.
        </p>

        <div className="mt-6 max-w-xl">
          <HomeSearch />
        </div>
      </div>

      <PersonalDashboard recentJobs={recentJobs} />

      <div className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-sm font-semibold text-muted">Quick access</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.label} href={link.href} className="card-soft btn-tactile p-4">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: link.bg, color: link.text }}
              >
                <link.icon className="h-4.5 w-4.5" strokeWidth={2} />
              </span>
              <span className="mt-3 block text-sm font-medium text-foreground">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
