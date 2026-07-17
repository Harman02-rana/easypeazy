import { CalendarClock, ClipboardCheck, Mail, Users } from "lucide-react";
import { computeUpcomingEvents, type UpcomingEvent } from "@/lib/applicationUtils";
import type { Application } from "@/lib/trackerTypes";
import EmptyState from "./EmptyState";

const TYPE_ICON: Record<UpcomingEvent["type"], typeof CalendarClock> = {
  Deadline: CalendarClock,
  OA: ClipboardCheck,
  Interview: Users,
  "Follow-up": Mail,
};

export default function UpcomingEvents({
  applications,
}: {
  applications: Application[];
}) {
  const events = computeUpcomingEvents(applications).slice(0, 8);

  return (
    <section>
      <h2 className="text-base font-semibold tracking-tight">Upcoming</h2>
      <div className="mt-3">
        {events.length === 0 ? (
          <EmptyState
            title="Nothing upcoming — enjoy the calm. ☀️"
            description="Deadlines, OAs, interviews, and follow-ups will show up here when it's time."
          />
        ) : (
          <div className="list-soft">
            {events.map((e) => {
              const Icon = TYPE_ICON[e.type];
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "var(--cat-interview-bg)", color: "var(--cat-interview)" }}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-foreground">
                      {e.company} — {e.role}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{e.type}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-muted">{e.date}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
