"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  House,
  LayoutDashboard,
  MapPin,
  Menu,
  NotebookPen,
  Sparkles,
  X,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import NavbarSearch from "./NavbarSearch";
import { SITE_NAME } from "@/lib/personalConfig";

const links = [
  { href: "/", label: "Home", icon: House },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/internships", label: "Internships", icon: GraduationCap },
  { href: "/india", label: "India", icon: MapPin },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/resources", label: "Resources", icon: BookOpen },
];

const trackerLinks = [
  { href: "/planner", label: "My Planner", icon: NotebookPen },
  { href: "/preparation", label: "Preparation", icon: GraduationCap },
  { href: "/applications", label: "My Applications", icon: ClipboardList },
];

function TrackerDropdown() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = trackerLinks.some((t) => pathname.startsWith(t.href));

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors cursor-pointer ${
          active
            ? "font-medium"
            : "text-muted hover:bg-surface-hover hover:text-foreground"
        }`}
        style={active ? { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" } : undefined}
      >
        <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={2} />
        My Tracker
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-xl border border-border bg-surface p-1 shadow-lg">
          {trackerLinks.map((t) => {
            const itemActive = pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                style={
                  itemActive
                    ? { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)", fontWeight: 500 }
                    : undefined
                }
              >
                <t.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                {t.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ background: "linear-gradient(145deg, var(--accent) 0%, var(--accent-strong) 100%)" }}
            >
              <Sparkles className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-tight">
                {SITE_NAME}
              </span>
              <span className="text-[11px] text-muted">2027 Placement Hub</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm sm:flex">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-3 py-1.5 transition-colors ${
                    active ? "font-medium" : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                  style={active ? { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" } : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
            <span className="mx-1 h-4 w-px bg-border" aria-hidden />
            <TrackerDropdown />
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="hidden sm:block">
            <NavbarSearch />
          </div>
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground sm:hidden cursor-pointer"
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border px-5 py-3 sm:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "font-medium" : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                  style={active ? { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" } : undefined}
                >
                  <link.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <p className="mt-3 border-t border-border px-3 pt-3 text-[11px] font-medium uppercase tracking-wide text-muted">
            My Tracker
          </p>
          <nav className="mt-1 flex flex-col gap-1">
            {trackerLinks.map((t) => {
              const active = pathname.startsWith(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "font-medium" : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                  style={active ? { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" } : undefined}
                >
                  <t.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  {t.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-2 border-t border-border pt-3">
            <NavbarSearch />
          </div>
        </div>
      )}
      <div className="brand-strip" aria-hidden />
    </header>
  );
}
