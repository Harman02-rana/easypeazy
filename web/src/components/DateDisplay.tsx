"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

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

  useEffect(() => {
    setDate(formatDate(new Date()));
  }, []);

  return (
    <span className={`flex items-center gap-1 ${className}`}>
      <CalendarDays className="h-3 w-3 shrink-0" strokeWidth={2} />
      {date ?? ""}
    </span>
  );
}
