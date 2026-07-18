"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, FileText, GraduationCap, NotebookPen } from "lucide-react";
import BackupControls from "./BackupControls";

const tabs = [
  { href: "/planner", label: "My Planner", icon: NotebookPen },
  { href: "/preparation", label: "Preparation", icon: GraduationCap },
  { href: "/applications", label: "My Applications", icon: ClipboardList },
  { href: "/resume-studio", label: "Resume Studio", icon: FileText },
];

export default function TrackerHeader() {
  const pathname = usePathname();

  return (
    <div className="mb-8 flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <nav className="inline-flex flex-wrap gap-1 rounded-xl border border-border bg-surface p-1">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                active ? "font-medium shadow-sm" : "text-muted hover:text-foreground"
              }`}
              style={active ? { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" } : undefined}
            >
              <tab.icon className="h-3.5 w-3.5" strokeWidth={2} />
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <BackupControls />
    </div>
  );
}
