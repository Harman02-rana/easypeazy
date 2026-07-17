"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Read-only month grid, today highlighted — no date picking/selection,
 * this is just "what does this month look like" glanced from the header. */
export default function MiniCalendar({ today = new Date() }: { today?: Date }) {
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  function goPrev() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goNext() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  return (
    <div className="w-64 rounded-xl border border-border bg-surface p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={goPrev}
          aria-label="Previous month"
          className="flex h-6 w-6 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <p className="text-sm font-medium text-foreground">
          {MONTH_LABELS[viewMonth]} {viewYear}
        </p>
        <button
          onClick={goNext}
          aria-label="Next month"
          className="flex h-6 w-6 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
        >
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px]">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} className="py-1 font-medium text-muted">
            {label}
          </span>
        ))}
        {cells.map((day, i) =>
          day === null ? (
            <span key={i} />
          ) : (
            <span
              key={i}
              className="flex h-7 w-7 items-center justify-center justify-self-center rounded-full"
              style={
                isToday(day)
                  ? { backgroundColor: "var(--accent)", color: "white", fontWeight: 600 }
                  : { color: "var(--foreground)" }
              }
            >
              {day}
            </span>
          )
        )}
      </div>
    </div>
  );
}
