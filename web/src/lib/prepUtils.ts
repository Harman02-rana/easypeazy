import type { PrepCategory, StudyTopic } from "./trackerTypes";

export function averageProgress(topics: StudyTopic[]): number {
  if (topics.length === 0) return 0;
  const sum = topics.reduce((acc, t) => acc + t.progress, 0);
  return Math.round(sum / topics.length);
}

export function progressForCategories(
  topics: StudyTopic[],
  categories: PrepCategory[]
): number {
  return averageProgress(topics.filter((t) => categories.includes(t.category)));
}

const CORE_CS_CATEGORIES: PrepCategory[] = [
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "OOP",
  "SQL",
  "Computer Science Fundamentals",
];

const INTERVIEW_PREP_CATEGORIES: PrepCategory[] = [
  "Interview Preparation",
  "Behavioral / HR",
  "Online Assessment Preparation",
];

export interface HeadlineProgress {
  overall: number;
  dsa: number;
  coreCs: number;
  aptitude: number;
  interviewPrep: number;
  projects: number;
}

export function computeHeadlineProgress(topics: StudyTopic[]): HeadlineProgress {
  return {
    overall: averageProgress(topics),
    dsa: progressForCategories(topics, ["DSA"]),
    coreCs: progressForCategories(topics, CORE_CS_CATEGORIES),
    aptitude: progressForCategories(topics, ["Aptitude"]),
    interviewPrep: progressForCategories(topics, INTERVIEW_PREP_CATEGORIES),
    projects: progressForCategories(topics, ["Projects"]),
  };
}

export function questionsSolved(topics: StudyTopic[]): number {
  return topics.reduce((acc, t) => acc + t.questionsCompleted, 0);
}

export function topicsCompletedCount(topics: StudyTopic[]): number {
  return topics.filter((t) => t.status === "Completed").length;
}
