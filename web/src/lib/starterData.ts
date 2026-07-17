import { generateId } from "./storage";
import type { RoadmapMilestone, StudyTopic } from "./trackerTypes";

/** Starter content only — every field is honest (Not Started, 0 progress,
 * 0 questions completed, not marked done). Nothing here claims progress
 * that hasn't actually happened; it exists so the tracker isn't a blank
 * page on day one, and every item is fully editable/deletable. */

function topic(
  topic: string,
  category: StudyTopic["category"],
  targetMonth: string
): StudyTopic {
  return {
    id: generateId(),
    topic,
    category,
    status: "Not Started",
    progress: 0,
    targetMonth,
    questionsTarget: 0,
    questionsCompleted: 0,
    resourceName: "",
    resourceUrl: "",
    notes: "",
  };
}

const DSA_TOPICS = [
  "Arrays",
  "Strings",
  "Hashing",
  "Linked Lists",
  "Stacks",
  "Queues",
  "Recursion",
  "Backtracking",
  "Binary Search",
  "Sorting",
  "Trees",
  "Binary Search Trees",
  "Heaps",
  "Graphs",
  "Greedy",
  "Dynamic Programming",
  "Tries",
  "Bit Manipulation",
];

const CORE_CS_TOPICS: { topic: string; category: StudyTopic["category"] }[] = [
  { topic: "ER Model & Normalization", category: "DBMS" },
  { topic: "Transactions & ACID", category: "DBMS" },
  { topic: "Indexing", category: "DBMS" },
  { topic: "Joins & Query Optimization", category: "DBMS" },
  { topic: "Processes & Threads", category: "Operating Systems" },
  { topic: "CPU Scheduling", category: "Operating Systems" },
  { topic: "Memory Management & Paging", category: "Operating Systems" },
  { topic: "Deadlocks", category: "Operating Systems" },
  { topic: "OSI & TCP/IP Model", category: "Computer Networks" },
  { topic: "TCP vs UDP", category: "Computer Networks" },
  { topic: "HTTP/HTTPS & DNS", category: "Computer Networks" },
  { topic: "Classes, Objects & Encapsulation", category: "OOP" },
  { topic: "Inheritance & Polymorphism", category: "OOP" },
  { topic: "SOLID Principles", category: "OOP" },
  { topic: "Joins, Group By, Subqueries", category: "SQL" },
  { topic: "Window Functions", category: "SQL" },
];

export function createStarterStudyTopics(): StudyTopic[] {
  const dsaMonths = ["2026-07", "2026-08", "2026-09", "2026-10"];
  const dsa = DSA_TOPICS.map((name, i) =>
    topic(name, "DSA", dsaMonths[Math.min(i / 5 | 0, dsaMonths.length - 1)])
  );
  const coreCs = CORE_CS_TOPICS.map(({ topic: name, category }) =>
    topic(name, category, "2026-08")
  );
  return [...dsa, ...coreCs];
}

export function createStarterMilestones(): RoadmapMilestone[] {
  const suggested: { month: string; title: string; description: string }[] = [
    {
      month: "2026-07",
      title: "Foundation + Resume + DSA basics",
      description:
        "Get the resume in shape, set up GitHub/portfolio, and start DSA fundamentals (arrays, strings, hashing).",
    },
    {
      month: "2026-08",
      title: "DSA + DBMS + Aptitude",
      description:
        "Continue core DSA topics alongside DBMS fundamentals and aptitude practice.",
    },
    {
      month: "2026-09",
      title: "DSA + OS + Computer Networks",
      description:
        "Move into trees/graphs while covering OS and networking fundamentals.",
    },
    {
      month: "2026-10",
      title: "Advanced DSA + OA preparation",
      description:
        "Dynamic programming, greedy, tries, and timed online-assessment practice.",
    },
    {
      month: "2026-11",
      title: "Interview preparation + Core CS revision",
      description:
        "Mock interviews, behavioral prep, and a revision pass over DBMS/OS/CN/OOP.",
    },
    {
      month: "2026-12",
      title: "Revision + Projects + Applications",
      description:
        "Polish projects, revise weak areas, and start submitting applications as they open.",
    },
    {
      month: "2027-01",
      title: "Applications + Interviews + Revision",
      description:
        "Keep applying, take interviews as they come, and keep a light revision routine going.",
    },
  ];

  return suggested.map((m) => ({
    id: generateId(),
    month: m.month,
    title: m.title,
    description: m.description,
    completed: false,
  }));
}
