"use client";

import { useEffect, useState } from "react";
import { CalendarClock, X } from "lucide-react";
import { useReminderDismissals } from "@/hooks/useTracker";
import { buildReminders, type HiringReminder } from "@/lib/reminders";

const MAX_VISIBLE = 3;

export default function HiringReminders() {
  const { hydrated, isDismissed, dismiss } = useReminderDismissals();
  const [reminders, setReminders] = useState<HiringReminder[]>([]);

  useEffect(() => {
    setReminders(buildReminders());
  }, []);

  if (!hydrated || reminders.length === 0) return null;

  const visible = reminders.filter((r) => !isDismissed(r.id)).slice(0, MAX_VISIBLE);
  if (visible.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-xs flex-col gap-2 sm:max-w-sm">
      {visible.map((reminder) => (
        <div
          key={reminder.id}
          className="card-soft flex items-start gap-2.5 p-3.5"
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
  );
}
