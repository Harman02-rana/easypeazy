/**
 * Modular company source configuration — the single place new companies get
 * added as this grows past 300. Each entry describes WHERE to look for a
 * company's postings and WHAT we already know about its hiring rhythm, so
 * both the automatic fetcher (lib/jobSources/) and the Hiring Calendar can
 * read from the same list without duplicating company metadata.
 *
 * Adding a company is always just pushing one more object onto
 * COMPANY_SOURCES — nothing else needs to change.
 */

export const ATS_PROVIDERS = ["Greenhouse", "Lever", "Ashby", "Workday", "Direct"] as const;
export type ATSProvider = (typeof ATS_PROVIDERS)[number];

export const COMPANY_CATEGORIES = [
  "Big Tech",
  "Product Companies",
  "Indian Startups",
  "AI Companies",
  "Semiconductor Companies",
  "Service Companies",
  "Government Organizations",
] as const;
export type CompanyCategory = (typeof COMPANY_CATEGORIES)[number];

export const HIRING_PATTERNS = ["Rolling", "Seasonal", "Batch", "Ad-hoc"] as const;
export type HiringPattern = (typeof HIRING_PATTERNS)[number];

export interface CompanySource {
  /** Stable id used everywhere else (notes, calendar, saved/applied refs) —
   * lowercase-kebab, independent of display name so renaming a company later
   * doesn't orphan any user data. */
  id: string;
  name: string;
  careersUrl: string;
  atsProvider: ATSProvider;
  /**
   * The token the ATS's public API needs to look up this company's board —
   * usually the slug in their careers URL (e.g. jobs.ashbyhq.com/<token>).
   * Only meaningful for Greenhouse/Lever/Ashby; left blank for Workday and
   * Direct sources, which don't have a simple public JSON API and so are
   * excluded from automatic fetching today (still fully valid for the
   * Hiring Calendar and as a manual reference).
   */
  boardToken?: string;
  category: CompanyCategory;
  hiringPattern: HiringPattern;
  /** Months this company has historically opened hiring in, e.g.
   * ["August", "September"]. Drives the Hiring Calendar + reminders. */
  expectedHiringMonths: string[];
  country: string;
  tags: string[];
}

export const COMPANY_SOURCES: CompanySource[] = [
  // ---- Big Tech ----------------------------------------------------------
  {
    id: "google",
    name: "Google",
    careersUrl: "https://careers.google.com",
    atsProvider: "Direct",
    category: "Big Tech",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["September", "October"],
    country: "Global",
    tags: ["Software Engineer", "AI/ML", "Cloud"],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    careersUrl: "https://careers.microsoft.com",
    atsProvider: "Workday",
    category: "Big Tech",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["September"],
    country: "Global",
    tags: ["Software Engineer", "Cloud", "AI/ML"],
  },
  {
    id: "amazon",
    name: "Amazon",
    careersUrl: "https://www.amazon.jobs",
    atsProvider: "Direct",
    category: "Big Tech",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["July", "August", "September", "October"],
    country: "Global",
    tags: ["Software Engineer", "Cloud"],
  },
  {
    id: "adobe",
    name: "Adobe",
    careersUrl: "https://careers.adobe.com",
    atsProvider: "Workday",
    category: "Big Tech",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["August"],
    country: "Global",
    tags: ["Software Engineer"],
  },
  {
    id: "meta",
    name: "Meta",
    careersUrl: "https://www.metacareers.com",
    atsProvider: "Direct",
    category: "Big Tech",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["August", "September"],
    country: "Global",
    tags: ["Software Engineer", "AI/ML"],
  },

  // ---- Product Companies --------------------------------------------------
  {
    id: "stripe",
    name: "Stripe",
    careersUrl: "https://stripe.com/jobs",
    atsProvider: "Greenhouse",
    boardToken: "stripe",
    category: "Product Companies",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "Global",
    tags: ["Software Engineer", "Cloud"],
  },
  {
    id: "notion",
    name: "Notion",
    careersUrl: "https://www.notion.so/careers",
    atsProvider: "Greenhouse",
    boardToken: "notion",
    category: "Product Companies",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "Global",
    tags: ["Software Engineer"],
  },
  {
    id: "figma",
    name: "Figma",
    careersUrl: "https://www.figma.com/careers",
    atsProvider: "Greenhouse",
    boardToken: "figma",
    category: "Product Companies",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "Global",
    tags: ["Software Engineer"],
  },
  {
    id: "ramp",
    name: "Ramp",
    careersUrl: "https://ramp.com/careers",
    atsProvider: "Greenhouse",
    boardToken: "ramp",
    category: "Product Companies",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "Global",
    tags: ["Software Engineer"],
  },

  // ---- AI Companies -------------------------------------------------------
  {
    id: "anthropic",
    name: "Anthropic",
    careersUrl: "https://www.anthropic.com/careers",
    atsProvider: "Greenhouse",
    boardToken: "anthropic",
    category: "AI Companies",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "Global",
    tags: ["AI/ML", "Software Engineer"],
  },
  {
    id: "openai",
    name: "OpenAI",
    careersUrl: "https://openai.com/careers",
    atsProvider: "Ashby",
    boardToken: "openai",
    category: "AI Companies",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "Global",
    tags: ["AI/ML", "Software Engineer"],
  },
  {
    id: "cohere",
    name: "Cohere",
    careersUrl: "https://cohere.com/careers",
    atsProvider: "Ashby",
    boardToken: "cohere",
    category: "AI Companies",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "Global",
    tags: ["AI/ML", "Software Engineer"],
  },
  {
    id: "scale-ai",
    name: "Scale AI",
    careersUrl: "https://scale.com/careers",
    atsProvider: "Greenhouse",
    boardToken: "scaleai",
    category: "AI Companies",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "Global",
    tags: ["AI/ML", "Data Science"],
  },

  // ---- Semiconductor Companies --------------------------------------------
  {
    id: "nvidia",
    name: "NVIDIA",
    careersUrl: "https://www.nvidia.com/en-us/about-nvidia/careers/",
    atsProvider: "Workday",
    category: "Semiconductor Companies",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["August"],
    country: "Global",
    tags: ["Embedded", "Software Engineer"],
  },
  {
    id: "qualcomm",
    name: "Qualcomm",
    careersUrl: "https://careers.qualcomm.com",
    atsProvider: "Workday",
    category: "Semiconductor Companies",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["August"],
    country: "Global",
    tags: ["Embedded", "Software Engineer"],
  },
  {
    id: "amd",
    name: "AMD",
    careersUrl: "https://careers.amd.com",
    atsProvider: "Direct",
    category: "Semiconductor Companies",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["August"],
    country: "Global",
    tags: ["Embedded", "Software Engineer"],
  },
  {
    id: "intel",
    name: "Intel",
    careersUrl: "https://jobs.intel.com",
    atsProvider: "Workday",
    category: "Semiconductor Companies",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["August", "September"],
    country: "Global",
    tags: ["Embedded", "Software Engineer"],
  },

  // ---- Indian Startups ----------------------------------------------------
  {
    id: "phonepe",
    name: "PhonePe",
    careersUrl: "https://www.phonepe.com/careers/",
    atsProvider: "Direct",
    category: "Indian Startups",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "India",
    tags: ["Software Engineer"],
  },
  {
    id: "razorpay",
    name: "Razorpay",
    careersUrl: "https://razorpay.com/jobs/",
    atsProvider: "Greenhouse",
    boardToken: "razorpaysoftwareprivatelimited",
    category: "Indian Startups",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "India",
    tags: ["Software Engineer"],
  },
  {
    id: "cred",
    name: "CRED",
    careersUrl: "https://careers.cred.club",
    atsProvider: "Direct",
    category: "Indian Startups",
    hiringPattern: "Rolling",
    expectedHiringMonths: [],
    country: "India",
    tags: ["Software Engineer"],
  },
  {
    id: "zerodha",
    name: "Zerodha",
    careersUrl: "https://zerodha.com/careers/",
    atsProvider: "Direct",
    category: "Indian Startups",
    hiringPattern: "Ad-hoc",
    expectedHiringMonths: [],
    country: "India",
    tags: ["Software Engineer"],
  },
  {
    id: "swiggy",
    name: "Swiggy",
    careersUrl: "https://careers.swiggy.com",
    atsProvider: "Direct",
    category: "Indian Startups",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["July", "August"],
    country: "India",
    tags: ["Software Engineer"],
  },

  // ---- Service Companies --------------------------------------------------
  {
    id: "tcs",
    name: "TCS",
    careersUrl: "https://www.tcs.com/careers",
    atsProvider: "Direct",
    category: "Service Companies",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["August", "September"],
    country: "India",
    tags: ["Software Engineer"],
  },
  {
    id: "infosys",
    name: "Infosys",
    careersUrl: "https://www.infosys.com/careers.html",
    atsProvider: "Direct",
    category: "Service Companies",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["September"],
    country: "India",
    tags: ["Software Engineer"],
  },
  {
    id: "cognizant",
    name: "Cognizant",
    careersUrl: "https://careers.cognizant.com",
    atsProvider: "Direct",
    category: "Service Companies",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["August"],
    country: "India",
    tags: ["Software Engineer"],
  },
  {
    id: "capgemini",
    name: "Capgemini",
    careersUrl: "https://www.capgemini.com/careers/",
    atsProvider: "Workday",
    category: "Service Companies",
    hiringPattern: "Seasonal",
    expectedHiringMonths: ["August", "September"],
    country: "India",
    tags: ["Software Engineer"],
  },

  // ---- Government Organizations -------------------------------------------
  {
    id: "isro",
    name: "ISRO",
    careersUrl: "https://www.isro.gov.in/Careers.html",
    atsProvider: "Direct",
    category: "Government Organizations",
    hiringPattern: "Ad-hoc",
    expectedHiringMonths: [],
    country: "India",
    tags: ["Government", "Embedded"],
  },
  {
    id: "drdo",
    name: "DRDO",
    careersUrl: "https://www.drdo.gov.in/drdo/careers",
    atsProvider: "Direct",
    category: "Government Organizations",
    hiringPattern: "Ad-hoc",
    expectedHiringMonths: [],
    country: "India",
    tags: ["Government", "Embedded"],
  },
];

/** Shared category → color mapping (reused by the Hiring Calendar and the
 * Ongoing Hiring dashboard's category filter) so a category always reads
 * the same tint everywhere, using the same --cat-* tokens as the rest of
 * the site rather than inventing new colors. */
export function categoryTint(category: CompanyCategory): { text: string; bg: string } {
  switch (category) {
    case "Big Tech":
      return { text: "var(--cat-applications)", bg: "var(--cat-applications-bg)" };
    case "Product Companies":
      return { text: "var(--cat-study)", bg: "var(--cat-study-bg)" };
    case "Indian Startups":
      return { text: "var(--cat-interview)", bg: "var(--cat-interview-bg)" };
    case "AI Companies":
      return { text: "var(--cat-sister)", bg: "var(--cat-sister-bg)" };
    case "Semiconductor Companies":
      return { text: "var(--cat-planner)", bg: "var(--cat-planner-bg)" };
    case "Service Companies":
      return { text: "var(--cat-offer)", bg: "var(--cat-offer-bg)" };
    case "Government Organizations":
    default:
      return { text: "var(--muted)", bg: "var(--surface-hover)" };
  }
}

export function getCompanySource(id: string): CompanySource | undefined {
  return COMPANY_SOURCES.find((c) => c.id === id);
}

export function companiesByCategory(category: CompanyCategory): CompanySource[] {
  return COMPANY_SOURCES.filter((c) => c.category === category);
}

/** Only sources with a boardToken on a supported ATS can be fetched
 * automatically — Workday/Direct sources are calendar/reference-only until
 * their own adapters exist. */
export function fetchableCompanySources(): CompanySource[] {
  return COMPANY_SOURCES.filter(
    (c) => c.boardToken && (c.atsProvider === "Greenhouse" || c.atsProvider === "Lever" || c.atsProvider === "Ashby")
  );
}
