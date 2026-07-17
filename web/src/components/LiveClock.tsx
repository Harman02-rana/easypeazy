"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import LiveClockPopover from "./LiveClockPopover";

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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTime(formatTime(new Date()));
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
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
        className={`flex items-center gap-1 tabular-nums cursor-pointer ${className}`}
      >
        <Clock className="h-3 w-3 shrink-0" strokeWidth={2} />
        {time ?? "--:--:-- --"}
      </button>

      {open && (
        <div className="fixed left-1/2 top-16 z-20 -translate-x-1/2 sm:absolute sm:left-0 sm:top-full sm:mt-2 sm:translate-x-0">
          <LiveClockPopover />
        </div>
      )}
    </div>
  );
}
