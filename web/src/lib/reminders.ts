import { buildHiringCalendar } from "./hiringCalendar";

export interface HiringReminder {
  /** Stable per company + month + year, so a dismissed reminder doesn't
   * reappear until next year's cycle for that same window. */
  id: string;
  companyName: string;
  message: string;
  daysUntilStart: number;
}

/** Reminders for anything opening within `windowDays` (default 30) or
 * already open this month — the Hiring Calendar is the single source of
 * truth these are generated from, so a company only ever needs its
 * expectedHiringMonths updated in companyConfig.ts for its reminder wording
 * to follow automatically. */
export function buildReminders(referenceDate: Date = new Date(), windowDays = 30): HiringReminder[] {
  const groups = buildHiringCalendar(referenceDate);
  const year = referenceDate.getFullYear();
  const reminders: HiringReminder[] = [];

  for (const group of groups) {
    const withinWindow = group.isCurrentMonth || (group.daysUntilStart > 0 && group.daysUntilStart <= windowDays);
    if (!withinWindow) continue;

    for (const company of group.companies) {
      let message: string;
      if (group.isCurrentMonth) {
        message = `${company.name} hiring usually opens around now — worth checking this week.`;
      } else if (group.daysUntilStart <= 7) {
        message = `${company.name} applications are expected to open this week.`;
      } else {
        message = `${company.name} applications are expected in about ${group.daysUntilStart} days.`;
      }

      reminders.push({
        id: `${company.id}-${group.month}-${year}`,
        companyName: company.name,
        message,
        daysUntilStart: group.isCurrentMonth ? 0 : group.daysUntilStart,
      });
    }
  }

  return reminders.sort((a, b) => a.daysUntilStart - b.daysUntilStart);
}
