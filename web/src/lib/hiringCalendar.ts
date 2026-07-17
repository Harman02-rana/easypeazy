import { COMPANY_SOURCES, type CompanySource } from "./companyConfig";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export interface CalendarMonthGroup {
  month: string;
  monthIndex: number;
  companies: CompanySource[];
  /** Days from the reference date to the 1st of this month's next
   * occurrence — negative/zero when we're already inside it. */
  daysUntilStart: number;
  isCurrentMonth: boolean;
}

/** Companies with no fixed seasonal window (Rolling/Ad-hoc) — always worth
 * checking, shown separately from the month-by-month grid. */
export function rollingCompanies(): CompanySource[] {
  return COMPANY_SOURCES.filter((c) => c.expectedHiringMonths.length === 0);
}

/** Builds the month-by-month view, sorted chronologically starting from
 * whatever month `referenceDate` falls in — so "what's coming up" reads
 * top to bottom without the caller needing to know today's date. */
export function buildHiringCalendar(referenceDate: Date = new Date()): CalendarMonthGroup[] {
  const byMonth = new Map<string, CompanySource[]>();
  for (const company of COMPANY_SOURCES) {
    for (const month of company.expectedHiringMonths) {
      if (!byMonth.has(month)) byMonth.set(month, []);
      byMonth.get(month)!.push(company);
    }
  }

  const currentMonthIndex = referenceDate.getMonth();
  const currentYear = referenceDate.getFullYear();

  const groups: CalendarMonthGroup[] = MONTH_NAMES.map((month, monthIndex) => {
    const isCurrentMonth = monthIndex === currentMonthIndex;
    const year = monthIndex < currentMonthIndex ? currentYear + 1 : currentYear;
    const target = new Date(year, monthIndex, 1);
    const daysUntilStart = Math.round(
      (target.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      month,
      monthIndex,
      companies: byMonth.get(month) ?? [],
      daysUntilStart,
      isCurrentMonth,
    };
  }).filter((g) => g.companies.length > 0);

  return groups.sort((a, b) => a.daysUntilStart - b.daysUntilStart);
}
