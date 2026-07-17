"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CalendarClock, X } from "lucide-react";
import { useReminderDismissals } from "@/hooks/useTracker";
import { buildReminders, type HiringReminder } from "@/lib/reminders";

/**
 * Replaces the old fixed bottom-right toast stack (which sat on top of
 * page content like the Ongoing Hiring "Apply" buttons). Same reminder
 * data/dismissal logic, just surfaced on demand from a header bell instead
 * of floating over whatever the user is looking at.
 */
export default function NotificationBell() {
  const { hydrated, isDismissed, dismiss } = useReminderDismissals();
  const [reminders, setReminders] = useState<HiringReminder[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReminders(buildReminders());
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const visible = hydrated ? reminders.filter((r) => !isDismissed(r.id)) : [];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
      >
        <Bell className="h-4 w-4" strokeWidth={2} />
        {visible.length > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {visible.length > 9 ? "9+" : visible.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-80 max-w-[90vw] rounded-xl border border-border bg-surface p-2 shadow-lg">
          <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide text-muted">
            Hiring Reminders
          </p>
          {visible.length === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-muted">You&apos;re all caught up.</p>
          ) : (
            <div className="flex max-h-80 flex-col gap-1.5 overflow-y-auto">
              {visible.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-start gap-2.5 rounded-lg p-2.5"
                  style={{ backgroundColor: "var(--accent-soft-bg)" }}
                >
                  <CalendarClock
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ color: "var(--accent)" }}
                    strokeWidth={2}
                  />
                  <p className="flex-1 text-sm leading-snug text-foreground">{reminder.message}</p>
                  <button
                    onClick={() => dismiss(reminder.id)}
                    aria-label="Dismiss reminder"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
