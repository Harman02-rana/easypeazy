import type { EmploymentType } from "./types";

/** Every ATS gives us a free-text job title and nothing structured about
 * batch year or employment type — these two heuristics are shared by every
 * adapter so "Software Engineer Intern - Summer 2026" and "New Grad
 * Engineer 2027" get classified the same way regardless of source. */

export function detectEmploymentType(title: string): EmploymentType {
  const t = title.toLowerCase();
  if (t.includes("intern")) return "Internship";
  if (
    t.includes("new grad") ||
    t.includes("new-grad") ||
    t.includes("graduate") ||
    t.includes("early career") ||
    t.includes("early-career") ||
    t.includes("university grad")
  ) {
    return "Full-Time";
  }
  return "Unknown";
}

export function detectBatchEligibility(title: string): string | undefined {
  const match = title.match(/20(2[5-9]|3[0-5])/);
  return match?.[0];
}

const RELEVANT_KEYWORDS = [
  "engineer",
  "engineering",
  "developer",
  "swe",
  "sde",
  "software",
  "programmer",
  "data scien",
  "machine learning",
  "ml ",
  " ai ",
  "devops",
  "cloud",
  "embedded",
  "firmware",
  "infrastructure",
  "security engineer",
  "qa engineer",
  "test engineer",
  "site reliability",
];

/** ATS boards list every open role at a company, not just engineering ones
 * — this keeps the fetch layer honest (it captures everything a source
 * actually has) while letting the dashboard show only roles relevant to a
 * software engineering job search, matching the rest of this site's scope. */
export function isRelevantEngineeringRole(title: string): boolean {
  const t = ` ${title.toLowerCase()} `;
  return RELEVANT_KEYWORDS.some((k) => t.includes(k));
}

export const TECH_CATEGORIES = [
  "AI/ML",
  "Data Science",
  "Cloud",
  "DevOps",
  "Embedded",
  "Software Engineer",
] as const;
export type TechCategory = (typeof TECH_CATEGORIES)[number];

/** Best-effort classification from the title alone, most-specific match
 * first — falls back to the generic "Software Engineer" bucket for
 * anything relevant that doesn't hit a more specific keyword. */
export function detectTechCategory(title: string): TechCategory {
  const t = title.toLowerCase();
  if (t.includes("machine learning") || t.includes(" ml ") || t.includes(" ai ") || t.includes("artificial intelligence")) {
    return "AI/ML";
  }
  if (t.includes("data scien") || t.includes("data engineer")) return "Data Science";
  if (t.includes("devops") || t.includes("site reliability") || t.includes(" sre")) return "DevOps";
  if (t.includes("cloud") || t.includes("infrastructure")) return "Cloud";
  if (t.includes("embedded") || t.includes("firmware")) return "Embedded";
  return "Software Engineer";
}
