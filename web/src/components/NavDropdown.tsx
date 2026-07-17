"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

export interface NavDropdownLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export default function NavDropdown({
  label,
  icon: Icon,
  items,
}: {
  label: string;
  icon: LucideIcon;
  items: NavDropdownLink[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = items.some((t) => pathname.startsWith(t.href));

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
          active ? "font-medium" : "text-muted hover:bg-surface-hover hover:text-foreground"
        }`}
        style={active ? { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)" } : undefined}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
        {label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-xl border border-border bg-surface p-1 shadow-lg">
          {items.map((item) => {
            const itemActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                style={
                  itemActive
                    ? { backgroundColor: "var(--accent-soft-bg)", color: "var(--accent)", fontWeight: 500 }
                    : undefined
                }
              >
                <item.icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
