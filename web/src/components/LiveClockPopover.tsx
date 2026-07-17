"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { motivationCornerMessageForToday } from "@/lib/milestoneMessages";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/** Same rotating quote-of-the-day as MotivationCorner, reused here rather
 * than a second message pool — one message per day, consistent wherever
 * it's shown. */
export default function LiveClockPopover() {
  const [time, setTime] = useState<string | null>(null);
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    setQuote(motivationCornerMessageForToday());
    setTime(formatTime(new Date()));
    const id = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  const [clock, meridiem] = (time ?? "--:--:-- --").split(" ");

  return (
    <div
      className="w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border p-5 text-center shadow-lg"
      style={{
        borderColor: "var(--cat-sister)",
        background: "linear-gradient(155deg, var(--accent-soft-bg) 0%, var(--cat-sister-bg) 100%)",
      }}
    >
      <p className="tabular-nums text-4xl font-semibold tracking-tight text-foreground">
        {clock}
        <span className="ml-1.5 align-top text-sm font-medium text-muted">{meridiem}</span>
      </p>

      <div className="my-4 h-px" style={{ backgroundColor: "var(--border)" }} />

      <div className="relative">
        <Quote
          className="absolute -left-1 -top-2 h-8 w-8 opacity-15"
          style={{ color: "var(--cat-sister)" }}
          strokeWidth={1.5}
          fill="var(--cat-sister)"
        />
        <p className="relative px-2 text-sm italic leading-relaxed text-foreground/90">
          &ldquo;{quote}&rdquo;
        </p>
      </div>
    </div>
  );
}
