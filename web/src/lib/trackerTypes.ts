// ---------------------------------------------------------------------------
// My Planner
// ---------------------------------------------------------------------------

export const PLANNER_CATEGORIES = [
  "Daily Plan",
  "Weekly Plan",
  "Monthly Goal",
  "Weekly Review",
  "Monthly Review",
  "Learning",
  "Interview Notes",
  "Career Goal",
  "Important",
  "Personal Note",
] as const;
export type PlannerCategory = (typeof PLANNER_CATEGORIES)[number];

export interface PlannerEntry {
  id: string;
  title: string;
  date: string; // ISO date (yyyy-mm-dd)
  content: string;
  category: PlannerCategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LittleWin {
  id: string;
  text: string;
  date: string; // ISO date
}

/** One personal note per company (keyed by company slug/id, not a list —
 * there's only ever one note per company, so this is an upsert record
 * rather than a CRUD list like everything else in this file). */
export interface CompanyNote {
  companyId: string;
  resumeVersion: string;
  referralStatus: string;
  interviewNotes: string;
  oaNotes: string;
  importantDates: string;
  updatedAt: string;
}

export const TASK_PRIORITIES = ["Low", "Medium", "High"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ["To Do", "In Progress", "Done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  task: string;
  dueDate: string; // ISO date
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
}

export const GOAL_CATEGORIES = [
  "Study",
  "Applications",
  "Projects",
  "Resume",
  "Interview",
  "Networking",
  "Personal",
] as const;
export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export interface MonthlyGoal {
  id: string;
  month: string; // "2026-07"
  goal: string;
  category: GoalCategory;
  target: string;
  progress: number; // 0-100
  notes: string;
}

// ---------------------------------------------------------------------------
// Preparation Tracker
// ---------------------------------------------------------------------------

export const PREP_CATEGORIES = [
  "DSA",
  "Aptitude",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "OOP",
  "SQL",
  "Computer Science Fundamentals",
  "System Design Basics",
  "Projects",
  "Resume",
  "GitHub / Portfolio",
  "Interview Preparation",
  "Behavioral / HR",
  "Online Assessment Preparation",
] as const;
export type PrepCategory = (typeof PREP_CATEGORIES)[number];

export const TOPIC_STATUSES = [
  "Not Started",
  "Learning",
  "Practicing",
  "Revision",
  "Completed",
] as const;
export type TopicStatus = (typeof TOPIC_STATUSES)[number];

export interface StudyTopic {
  id: string;
  topic: string;
  category: PrepCategory;
  status: TopicStatus;
  progress: number; // 0-100
  targetMonth: string; // "2026-07"
  questionsTarget: number;
  questionsCompleted: number;
  resourceName: string;
  resourceUrl: string;
  notes: string;
}

export interface RoadmapMilestone {
  id: string;
  month: string; // "2026-07"
  title: string;
  description: string;
  completed: boolean;
}

/** The 12 months this tracker plans across, in order. */
export const ROADMAP_MONTHS: string[] = [
  "2026-07",
  "2026-08",
  "2026-09",
  "2026-10",
  "2026-11",
  "2026-12",
  "2027-01",
  "2027-02",
  "2027-03",
  "2027-04",
  "2027-05",
  "2027-06",
];

export function formatMonth(month: string): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Application Tracker
// ---------------------------------------------------------------------------

export const JOB_TYPES = [
  "Internship",
  "New Grad",
  "Graduate Program",
  "Other",
] as const;
export type ApplicationJobType = (typeof JOB_TYPES)[number];

export const APPLICATION_STATUSES = [
  "Saved",
  "Applied",
  "OA",
  "Interview",
  "HR",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

/** Statuses shown in the main left-to-right pipeline; Rejected/Withdrawn
 * are tracked but shown separately since they're exits, not stages. */
export const PIPELINE_STATUSES: ApplicationStatus[] = [
  "Saved",
  "Applied",
  "OA",
  "Interview",
  "HR",
  "Offer",
];

export interface Application {
  id: string;
  company: string;
  role: string;
  jobType: ApplicationJobType;
  location: string;
  applicationLink: string;
  dateSaved: string;
  dateApplied: string;
  applicationDeadline: string;
  status: ApplicationStatus;
  oaDate: string;
  oaPlatform: string;
  oaResult: string;
  interviewDate: string;
  interviewRound: string;
  interviewResult: string;
  resumeVersion: string;
  followUpDate: string;
  notes: string;
}

/** Input for saving a job into the tracker. Only the fields we actually
 * know at save time are required; everything filled in later (OA,
 * interview, dates, notes...) is optional here and defaults to blank. */
export type NewApplicationInput = Pick<
  Application,
  "company" | "role" | "jobType" | "location" | "applicationLink"
> &
  Partial<
    Omit<Application, "id" | "dateSaved" | "company" | "role" | "jobType" | "location" | "applicationLink">
  >;
