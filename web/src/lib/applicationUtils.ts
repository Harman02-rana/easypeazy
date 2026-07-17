import type { Application } from "./trackerTypes";

export interface ApplicationStats {
  totalSaved: number;
  totalApplied: number;
  oas: number;
  interviews: number;
  offers: number;
  rejected: number;
  successRate: number | null;
}

/** "Reached this stage" counts, not just "currently at this exact status" —
 * an application that made it to Interview still counts toward OAs if it
 * had one, since that milestone genuinely happened. */
export function computeApplicationStats(applications: Application[]): ApplicationStats {
  const totalSaved = applications.length;
  const totalApplied = applications.filter(
    (a) => a.status !== "Saved" || Boolean(a.dateApplied)
  ).length;
  const oas = applications.filter(
    (a) => Boolean(a.oaDate) || Boolean(a.oaResult) || a.status === "OA"
  ).length;
  const interviews = applications.filter(
    (a) =>
      Boolean(a.interviewDate) ||
      Boolean(a.interviewResult) ||
      a.status === "Interview"
  ).length;
  const offers = applications.filter((a) => a.status === "Offer").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;

  const decided = offers + rejected;
  const successRate = decided > 0 ? Math.round((offers / decided) * 100) : null;

  return { totalSaved, totalApplied, oas, interviews, offers, rejected, successRate };
}

export interface UpcomingEvent {
  id: string;
  type: "Deadline" | "OA" | "Interview" | "Follow-up";
  date: string;
  company: string;
  role: string;
}

export function computeUpcomingEvents(applications: Application[]): UpcomingEvent[] {
  const today = new Date().toISOString().slice(0, 10);
  const events: UpcomingEvent[] = [];

  for (const a of applications) {
    if (a.applicationDeadline && a.applicationDeadline >= today) {
      events.push({
        id: `${a.id}-deadline`,
        type: "Deadline",
        date: a.applicationDeadline,
        company: a.company,
        role: a.role,
      });
    }
    if (a.oaDate && a.oaDate >= today) {
      events.push({ id: `${a.id}-oa`, type: "OA", date: a.oaDate, company: a.company, role: a.role });
    }
    if (a.interviewDate && a.interviewDate >= today) {
      events.push({
        id: `${a.id}-interview`,
        type: "Interview",
        date: a.interviewDate,
        company: a.company,
        role: a.role,
      });
    }
    if (a.followUpDate && a.followUpDate >= today) {
      events.push({
        id: `${a.id}-followup`,
        type: "Follow-up",
        date: a.followUpDate,
        company: a.company,
        role: a.role,
      });
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}
