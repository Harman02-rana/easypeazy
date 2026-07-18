import { looksLikeContactLine } from "./pdfExport";
import { parseResumeSections, type ResumeSectionType } from "./resumeSections";

export interface ResumeHealthCategory {
  label: string;
  score: number; // 0-100
  note: string;
}

export interface ResumeHealthResult {
  score: number; // 0-100, overall
  categories: ResumeHealthCategory[];
}

const EXPECTED_TYPES: ResumeSectionType[] = ["summary", "skills", "education", "experience", "projects"];
const METRIC_PATTERN = /\d+%|\$\d|\b\d{2,}\+?\b|\bx\d\b/i;

/** A JD-independent quality score — unlike the ATS Compatibility Analyzer
 * (which only makes sense once you have a job description to match
 * against), this is computable the moment a resume exists, so it can show
 * up directly on a version card before any analysis has ever been run. */
export function computeResumeHealth(content: string): ResumeHealthResult {
  const trimmed = content.trim();
  const sections = parseResumeSections(trimmed);
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const foundTypes = new Set(sections.map((s) => s.type));

  const sectionsFound = EXPECTED_TYPES.filter((t) => foundTypes.has(t));
  const sectionsScore = (sectionsFound.length / EXPECTED_TYPES.length) * 100;

  const hasContactInfo = sections.some((s) => s.type === "header" && looksLikeContactLine(s.body));
  const contactScore = hasContactInfo ? 100 : 0;

  const reasonableLength = wordCount >= 120 && wordCount <= 1500;
  const lengthScore = reasonableLength ? 100 : wordCount < 120 ? Math.round((wordCount / 120) * 100) : 60;

  const experienceAndProjects = sections.filter((s) => s.type === "experience" || s.type === "projects");
  const hasMetrics = experienceAndProjects.some((s) => METRIC_PATTERN.test(s.body));
  const metricsScore = experienceAndProjects.length === 0 ? 50 : hasMetrics ? 100 : 30;

  const categories: ResumeHealthCategory[] = [
    {
      label: "Section coverage",
      score: Math.round(sectionsScore),
      note:
        sectionsFound.length === EXPECTED_TYPES.length
          ? "All standard sections present."
          : `Missing: ${EXPECTED_TYPES.filter((t) => !foundTypes.has(t)).join(", ")}.`,
    },
    {
      label: "Contact info",
      score: contactScore,
      note: hasContactInfo ? "Email or phone detected." : "No email or phone number detected.",
    },
    {
      label: "Length",
      score: Math.round(lengthScore),
      note: reasonableLength ? "A healthy, ATS-friendly length." : wordCount < 120 ? "Looks thin — may be missing detail." : "Fairly long — consider trimming.",
    },
    {
      label: "Quantified impact",
      score: Math.round(metricsScore),
      note: hasMetrics
        ? "Experience/projects include numbers or metrics."
        : "No numbers or metrics detected in Experience/Projects — quantifying impact strengthens a resume.",
    },
  ];

  const score = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  return { score, categories };
}
