import { SKILL_DICTIONARY, isStopword } from "./atsSkills";
import type { AtsCategoryScore, AtsAnalysisResult } from "./trackerTypes";
import { ATS_CATEGORIES } from "./trackerTypes";
import { generateId } from "./storage";

export class AtsAnalysisError extends Error {}

const CATEGORY_WEIGHTS: Record<(typeof ATS_CATEGORIES)[number], number> = {
  skillsMatch: 0.3,
  keywordMatch: 0.2,
  experienceRelevance: 0.2,
  projectRelevance: 0.15,
  educationMatch: 0.05,
  resumeStructure: 0.1,
};

const CATEGORY_LABELS: Record<(typeof ATS_CATEGORIES)[number], string> = {
  skillsMatch: "Skills Match",
  keywordMatch: "Keyword Match",
  experienceRelevance: "Experience Relevance",
  projectRelevance: "Project Relevance",
  educationMatch: "Education Match",
  resumeStructure: "Resume Structure",
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whole-phrase, case-insensitive match with alnum-only boundaries — so
 * "C++" or "C#" match correctly (they don't have \b-friendly edges) without
 * matching inside an unrelated longer word. */
function textContainsPhrase(text: string, phrase: string): boolean {
  const pattern = new RegExp(`(?<![a-zA-Z0-9])${escapeRegExp(phrase)}(?![a-zA-Z0-9])`, "i");
  return pattern.test(text);
}

function extractSkillsFromText(text: string): string[] {
  return SKILL_DICTIONARY.filter((skill) => textContainsPhrase(text, skill));
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#]+/i)
    .filter((word) => word.length >= 4 && !isStopword(word) && !/^\d+$/.test(word));
}

/** Keywords from the JD that aren't already covered by the skill-dictionary
 * match, ranked by frequency — the "everything else that matters" signal,
 * kept distinct from Skills Match rather than double-counting the same terms. */
function extractJdKeywords(jobDescription: string, skillsInJd: string[], limit = 20): string[] {
  const skillWords = new Set(skillsInJd.flatMap((s) => tokenize(s)));
  const counts = new Map<string, number>();
  for (const word of tokenize(jobDescription)) {
    if (skillWords.has(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word]) => word);
}

function clampScore(value: number): number {
  return Math.round(Math.max(0, Math.min(100, value)));
}

// ---------------------------------------------------------------------------
// Category scorers — each returns a 0-100 score plus whatever detail the
// overall result needs to show. Every score is a deterministic heuristic
// over the plain text; there is no network call or randomness anywhere here.
// ---------------------------------------------------------------------------

function scoreSkillsMatch(resumeText: string, jobDescription: string) {
  const skillsInJd = extractSkillsFromText(jobDescription);
  const skillsInResume = new Set(extractSkillsFromText(resumeText).map((s) => s.toLowerCase()));
  const matched = skillsInJd.filter((s) => skillsInResume.has(s.toLowerCase()));
  const missing = skillsInJd.filter((s) => !skillsInResume.has(s.toLowerCase()));
  const score = skillsInJd.length === 0 ? 100 : (matched.length / skillsInJd.length) * 100;
  return { score: clampScore(score), skillsInJd, matched, missing };
}

function scoreKeywordMatch(resumeText: string, jobDescription: string, skillsInJd: string[]) {
  const jdKeywords = extractJdKeywords(jobDescription, skillsInJd);
  const resumeWords = new Set(tokenize(resumeText));
  const matched = jdKeywords.filter((k) => resumeWords.has(k));
  const missing = jdKeywords.filter((k) => !resumeWords.has(k));
  const score = jdKeywords.length === 0 ? 100 : (matched.length / jdKeywords.length) * 100;
  return { score: clampScore(score), matched, missing };
}

const EXPERIENCE_SECTION_PATTERN = /\b(work experience|professional experience|experience|internship|employment history)\b/i;
const EXPERIENCE_VERB_PATTERN = /\b(built|developed|designed|implemented|led|managed|engineered|architected|deployed|shipped|optimized|automated)\b/i;

function scoreExperienceRelevance(resumeText: string, jobDescription: string, jobRole: string) {
  const hasExperienceSection = EXPERIENCE_SECTION_PATTERN.test(resumeText);
  const hasActionVerbs = EXPERIENCE_VERB_PATTERN.test(resumeText);
  const sectionScore = (hasExperienceSection ? 60 : 20) + (hasActionVerbs ? 15 : 0);

  const roleSource = jobRole.trim() || jobDescription.slice(0, 200);
  const roleWords = tokenize(roleSource);
  const resumeWords = new Set(tokenize(resumeText));
  const overlap = roleWords.length === 0
    ? 1
    : roleWords.filter((w) => resumeWords.has(w)).length / roleWords.length;

  const score = sectionScore * 0.4 + overlap * 100 * 0.6;
  return { score: clampScore(score), hasExperienceSection };
}

const PROJECTS_SECTION_PATTERN = /\bprojects?\b/i;

/** Best-effort: grabs everything from a "Projects" heading to the next
 * all-caps/title-case heading line, or "" if no such heading is found. */
function extractProjectsSection(resumeText: string): string {
  const lines = resumeText.split(/\n/);
  const startIndex = lines.findIndex((line) => PROJECTS_SECTION_PATTERN.test(line.trim()) && line.trim().length < 40);
  if (startIndex === -1) return "";

  const rest = lines.slice(startIndex + 1);
  const nextHeadingIndex = rest.findIndex(
    (line) => /^[A-Z][A-Za-z\s/&]{2,30}$/.test(line.trim()) && line.trim().length < 40 && line.trim() === line.trim().toUpperCase()
  );
  const section = nextHeadingIndex === -1 ? rest : rest.slice(0, nextHeadingIndex);
  return section.join("\n");
}

function scoreProjectRelevance(resumeText: string, relevantTerms: string[]) {
  const projectsSection = extractProjectsSection(resumeText);
  const hasProjectsSection = projectsSection.trim().length > 0;
  const searchText = hasProjectsSection ? projectsSection : resumeText;

  if (relevantTerms.length === 0) {
    return { score: hasProjectsSection ? 100 : 70, hasProjectsSection };
  }

  const matched = relevantTerms.filter((term) => textContainsPhrase(searchText, term));
  const overlapScore = (matched.length / relevantTerms.length) * 100;
  const score = hasProjectsSection ? overlapScore : overlapScore * 0.7;
  return { score: clampScore(score), hasProjectsSection };
}

const EDUCATION_TERMS = [
  "Bachelor", "Bachelor's", "B.Tech", "BTech", "B.E.", "BE", "Master", "Master's",
  "M.Tech", "MTech", "M.E.", "MBA", "PhD", "Ph.D.", "Computer Science",
  "Information Technology", "Electronics", "Electrical Engineering",
  "Mechanical Engineering", "Engineering", "Degree", "University", "College",
];

function scoreEducationMatch(resumeText: string, jobDescription: string) {
  const educationInJd = EDUCATION_TERMS.filter((term) => textContainsPhrase(jobDescription, term));
  if (educationInJd.length === 0) {
    return { score: 100, mentioned: false };
  }
  const matched = educationInJd.filter((term) => textContainsPhrase(resumeText, term));
  const score = (matched.length / educationInJd.length) * 100;
  return { score: clampScore(score), mentioned: true };
}

const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_PATTERN = /(\+?\d[\d\s-]{8,}\d)/;
const EXPECTED_SECTIONS: { label: string; pattern: RegExp }[] = [
  { label: "Experience", pattern: EXPERIENCE_SECTION_PATTERN },
  { label: "Education", pattern: /\beducation\b/i },
  { label: "Skills", pattern: /\bskills\b/i },
  { label: "Projects", pattern: PROJECTS_SECTION_PATTERN },
];

function scoreResumeStructure(resumeText: string) {
  const sectionsFound = EXPECTED_SECTIONS.filter((s) => s.pattern.test(resumeText));
  const hasContactInfo = EMAIL_PATTERN.test(resumeText) || PHONE_PATTERN.test(resumeText);
  const wordCount = resumeText.trim().split(/\s+/).filter(Boolean).length;
  const reasonableLength = wordCount >= 120 && wordCount <= 1500;

  const score =
    (sectionsFound.length / EXPECTED_SECTIONS.length) * 60 +
    (hasContactInfo ? 20 : 0) +
    (reasonableLength ? 20 : 0);

  const missingSections = EXPECTED_SECTIONS.filter((s) => !sectionsFound.includes(s)).map((s) => s.label);
  return { score: clampScore(score), missingSections, hasContactInfo, reasonableLength };
}

// ---------------------------------------------------------------------------

function buildSuggestions(params: {
  categoryScores: AtsCategoryScore[];
  missingSkills: string[];
  missingKeywords: string[];
  structureDetail: ReturnType<typeof scoreResumeStructure>;
  experienceDetail: ReturnType<typeof scoreExperienceRelevance>;
  projectDetail: ReturnType<typeof scoreProjectRelevance>;
}): string[] {
  const { categoryScores, missingSkills, missingKeywords, structureDetail, experienceDetail, projectDetail } = params;
  const suggestions: string[] = [];

  const weakest = [...categoryScores].sort((a, b) => a.score - b.score);

  for (const cat of weakest) {
    if (cat.score >= 75) continue;
    switch (cat.category) {
      case "skillsMatch":
        if (missingSkills.length > 0) {
          suggestions.push(
            `If you genuinely have experience with these, add them to your resume: ${missingSkills.slice(0, 6).join(", ")}.`
          );
        }
        break;
      case "keywordMatch":
        if (missingKeywords.length > 0) {
          suggestions.push(
            `The job description uses terms your resume doesn't — consider working in: ${missingKeywords.slice(0, 6).join(", ")}.`
          );
        }
        break;
      case "experienceRelevance":
        if (!experienceDetail.hasExperienceSection) {
          suggestions.push("Add a clear Experience or Internship section — it's hard for ATS software to credit experience it can't find under a heading.");
        } else {
          suggestions.push("Tie your experience bullet points more directly to this role's responsibilities and title.");
        }
        break;
      case "projectRelevance":
        if (!projectDetail.hasProjectsSection) {
          suggestions.push("Add a dedicated Projects section — it's one of the highest-signal sections for entry-level and student resumes.");
        } else {
          suggestions.push("Highlight projects that use the specific tools and skills this job description asks for.");
        }
        break;
      case "educationMatch":
        suggestions.push("Make sure your degree and branch are stated clearly if they match what this role is asking for.");
        break;
      case "resumeStructure":
        if (structureDetail.missingSections.length > 0) {
          suggestions.push(`Add clearly labeled sections for: ${structureDetail.missingSections.join(", ")}.`);
        }
        if (!structureDetail.hasContactInfo) {
          suggestions.push("Make sure your email and phone number are present and easy to find.");
        }
        break;
    }
  }

  return suggestions.slice(0, 6);
}

export function analyzeResume(params: {
  resumeText: string;
  resumeFileName: string;
  jobDescription: string;
  companyName?: string;
  jobRole?: string;
}): AtsAnalysisResult {
  const resumeText = params.resumeText.trim();
  const jobDescription = params.jobDescription.trim();
  const companyName = (params.companyName ?? "").trim();
  const jobRole = (params.jobRole ?? "").trim();

  if (!resumeText) {
    throw new AtsAnalysisError("No resume text to analyze — upload a resume in Resume Studio first.");
  }
  if (!jobDescription) {
    throw new AtsAnalysisError("Paste a job description to analyze against.");
  }

  const skills = scoreSkillsMatch(resumeText, jobDescription);
  const keywords = scoreKeywordMatch(resumeText, jobDescription, skills.skillsInJd);
  const experience = scoreExperienceRelevance(resumeText, jobDescription, jobRole);
  const relevantTerms = [...skills.skillsInJd, ...keywords.matched, ...keywords.missing];
  const projects = scoreProjectRelevance(resumeText, relevantTerms);
  const education = scoreEducationMatch(resumeText, jobDescription);
  const structure = scoreResumeStructure(resumeText);

  const categoryScores: AtsCategoryScore[] = [
    {
      category: "skillsMatch",
      label: CATEGORY_LABELS.skillsMatch,
      score: skills.score,
      weight: CATEGORY_WEIGHTS.skillsMatch,
      note: `${skills.matched.length} of ${skills.skillsInJd.length} JD skills found in your resume.`,
    },
    {
      category: "keywordMatch",
      label: CATEGORY_LABELS.keywordMatch,
      score: keywords.score,
      weight: CATEGORY_WEIGHTS.keywordMatch,
      note: `${keywords.matched.length} of ${keywords.matched.length + keywords.missing.length} notable JD terms found in your resume.`,
    },
    {
      category: "experienceRelevance",
      label: CATEGORY_LABELS.experienceRelevance,
      score: experience.score,
      weight: CATEGORY_WEIGHTS.experienceRelevance,
      note: experience.hasExperienceSection
        ? "Experience section detected and compared against the role."
        : "No clear experience section detected.",
    },
    {
      category: "projectRelevance",
      label: CATEGORY_LABELS.projectRelevance,
      score: projects.score,
      weight: CATEGORY_WEIGHTS.projectRelevance,
      note: projects.hasProjectsSection
        ? "Projects section detected and compared against the role."
        : "No dedicated Projects section detected.",
    },
    {
      category: "educationMatch",
      label: CATEGORY_LABELS.educationMatch,
      score: education.score,
      weight: CATEGORY_WEIGHTS.educationMatch,
      note: education.mentioned
        ? "Job description mentions education requirements — compared against your resume."
        : "Job description doesn't call out specific education requirements.",
    },
    {
      category: "resumeStructure",
      label: CATEGORY_LABELS.resumeStructure,
      score: structure.score,
      weight: CATEGORY_WEIGHTS.resumeStructure,
      note: structure.missingSections.length === 0
        ? "All standard resume sections detected."
        : `Missing sections: ${structure.missingSections.join(", ")}.`,
    },
  ];

  const overallScore = clampScore(
    categoryScores.reduce((sum, cat) => sum + cat.score * cat.weight, 0)
  );

  const suggestions = buildSuggestions({
    categoryScores,
    missingSkills: skills.missing,
    missingKeywords: keywords.missing,
    structureDetail: structure,
    experienceDetail: experience,
    projectDetail: projects,
  });

  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    companyName,
    jobRole,
    jobDescription,
    resumeFileName: params.resumeFileName,
    overallScore,
    categoryScores,
    matchedSkills: skills.matched,
    missingSkills: skills.missing,
    matchedKeywords: keywords.matched,
    missingKeywords: keywords.missing,
    suggestions,
    aiInsights: null,
  };
}

/** A deterministic "what if you fixed the gaps" estimate — not a second AI
 * call, just the same category weights re-applied with skills/keyword
 * match assumed fixed. Gives the coach checklist something concrete to
 * point at without inventing a new scoring system. */
export function estimateImprovedScore(result: AtsAnalysisResult): number {
  let hypothetical = 0;
  for (const cat of result.categoryScores) {
    let score = cat.score;
    if (cat.category === "skillsMatch" && result.missingSkills.length > 0) score = 100;
    if (cat.category === "keywordMatch" && result.missingKeywords.length > 0) score = Math.min(100, score + 25);
    hypothetical += score * cat.weight;
  }
  return Math.round(Math.min(100, Math.max(hypothetical, result.overallScore)));
}
