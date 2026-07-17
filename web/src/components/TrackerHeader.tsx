"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BackupControls from "./BackupControls";

const tabs = [
  { href: "/planner", label: "My Planner" },
  { href: "/preparation", label: "Preparation" },
  { href: "/applications", label: "My Applications" },
];

export default function TrackerHeader() {
  const pathname = usePathname();

  return (
    <div className="mb-8 flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      <nav className="flex flex-wrap gap-1">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-surface-hover font-medium text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <BackupControls />
    </div>
  );
}
