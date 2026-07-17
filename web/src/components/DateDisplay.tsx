"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import MiniCalendar from "./MiniCalendar";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Only needs to compute once per mount (a day doesn't change mid-session
 * the way a clock does) — client-only effect purely to avoid a server/
 * client hydration mismatch from timezone differences, not because it
 * needs to re-run. */
export default function DateDisplay({ className = "" }: { className?: string }) {
  const [date, setDate] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDate(formatDate(new Date()));
  }, []);

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
        className={`flex items-center gap-1 cursor-pointer ${className}`}
      >
        <CalendarDays className="h-3 w-3 shrink-0" strokeWidth={2} />
        {date ?? ""}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2">
          <MiniCalendar />
        </div>
      )}
    </div>
  );
}
