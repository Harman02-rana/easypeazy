import { isLikelyHeadingLine, looksLikeContactLine, normalizeResumeLines } from "./pdfExport";

export const RESUME_SECTION_TYPES = [
  "header",
  "summary",
  "skills",
  "education",
  "experience",
  "projects",
  "certifications",
  "achievements",
  "other",
] as const;
export type ResumeSectionType = (typeof RESUME_SECTION_TYPES)[number];

export const SECTION_TYPE_LABELS: Record<ResumeSectionType, string> = {
  header: "Personal Information",
  summary: "Professional Summary",
  skills: "Skills",
  education: "Education",
  experience: "Experience",
  projects: "Projects",
  certifications: "Certifications",
  achievements: "Achievements",
  other: "Other",
};

export interface ResumeSection {
  id: string;
  type: ResumeSectionType;
  heading: string;
  body: string;
}

const SECTION_TYPE_PATTERNS: [ResumeSectionType, RegExp][] = [
  ["summary", /^(summary|objective|profile)\b/i],
  ["skills", /^(technical\s+)?skills\b/i],
  ["education", /^education\b/i],
  ["experience", /^(work\s+experience|professional\s+experience|experience|internships?)\b/i],
  ["projects", /^projects?\b/i],
  ["certifications", /^certifications?\b/i],
  ["achievements", /^(achievements?|awards?)\b/i],
];

function classifyHeading(heading: string): ResumeSectionType {
  for (const [type, pattern] of SECTION_TYPE_PATTERNS) {
    if (pattern.test(heading.trim())) return type;
  }
  return "other";
}

/** Splits raw resume text into a header block (name + contact) plus one
 * section per detected heading, reusing the exact same heading/contact
 * heuristics as the PDF renderer and preview so all three views of the
 * resume — plain text, PDF, and this editor — agree on structure. Best
 * effort, not a real document parser: resumes without clear line-per-
 * heading structure fall back to a single "Other" section, which is still
 * editable, just not split further. */
export function parseResumeSections(content: string): ResumeSection[] {
  const lines = normalizeResumeLines(content);
  const sections: ResumeSection[] = [];
  let i = 0;

  const headerLines: string[] = [];
  if (lines[0] && lines[0] !== "") {
    headerLines.push(lines[0]);
    i = 1;
    while (i < lines.length && (lines[i] === "" || looksLikeContactLine(lines[i]))) {
      if (lines[i] !== "") headerLines.push(lines[i]);
      i++;
    }
  }
  if (headerLines.length > 0) {
    sections.push({ id: "header", type: "header", heading: SECTION_TYPE_LABELS.header, body: headerLines.join("\n") });
  }

  let current: ResumeSection | null = null;
  let otherCount = 0;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line === "") continue;

    if (isLikelyHeadingLine(line)) {
      if (current) sections.push(current);
      const type = classifyHeading(line);
      current = { id: `${type}-${sections.length}`, type, heading: line, body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      current = { id: `other-${otherCount++}`, type: "other", heading: SECTION_TYPE_LABELS.other, body: line };
    }
  }
  if (current) sections.push(current);

  return sections;
}

/** Inverse of `parseResumeSections` — reassembles edited sections back
 * into one plain-text resume, in the same order they were given. */
export function stringifyResumeSections(sections: ResumeSection[]): string {
  return sections
    .map((s) => (s.type === "header" ? s.body : `${s.heading}\n${s.body}`))
    .join("\n\n")
    .trim();
}
