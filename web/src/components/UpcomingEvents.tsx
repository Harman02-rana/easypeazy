import { computeUpcomingEvents } from "@/lib/applicationUtils";
import type { Application } from "@/lib/trackerTypes";
import EmptyState from "./EmptyState";

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
            {events.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="text-sm text-foreground">
                    {e.company} — {e.role}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{e.type}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">{e.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
