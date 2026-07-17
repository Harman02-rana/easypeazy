"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/** Ticks every second, entirely self-contained — the interval and its
 * re-renders live only here, so sibling widget pieces (date, goal) never
 * re-render just because the clock ticked. Starts rendering `null` on the
 * server/first paint (time is inherently client-only) and fills in after
 * mount, same SSR-safe pattern as Greeting.tsx. */
export default function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTime(new Date()));
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`flex items-center gap-1 tabular-nums ${className}`}>
      <Clock className="h-3 w-3 shrink-0" strokeWidth={2} />
      {time ?? "--:--:-- --"}
    </span>
  );
}
