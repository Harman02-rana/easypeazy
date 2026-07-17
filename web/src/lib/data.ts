import companiesData from "../../data/companies.json";
import jobsRaw from "../../data/jobs.json";
import resourcesData from "../../data/resources.json";
import type { Company, Job, LocationBucket, Resource } from "./types";

interface RawJob {
  id: number;
  company: string;
  companySlug: string;
  position: string;
  type: "New Grad" | "Internship";
  country: string;
  location: string;
  applyLink: string;
  datePosted: string;
  source: string;
}

const enrichedCompanies = companiesData as Company[];
const enrichedBySlug = new Map(enrichedCompanies.map((c) => [c.slug, c]));

function locationBucketFor(country: string, location: string): LocationBucket {
  if (location.toLowerCase().includes("remote")) return "Remote";
  if (country === "India") return "India";
  return "International";
}

function categoryForCompany(slug: string): string {
  return enrichedBySlug.get(slug)?.category ?? "";
}

let cachedJobs: Job[] | null = null;

export function getJobs(): Job[] {
  if (cachedJobs) return cachedJobs;
  cachedJobs = (jobsRaw as RawJob[]).map((j) => ({
    ...j,
    category: categoryForCompany(j.companySlug),
    locationBucket: locationBucketFor(j.country, j.location),
  }));
  return cachedJobs;
}

export function getJobById(id: number): Job | undefined {
  return getJobs().find((j) => j.id === id);
}

export function getJobsForCompany(slug: string): Job[] {
  return getJobs().filter((j) => j.companySlug === slug);
}

/** Every company that has at least one job, enriched with careers/internship
 * links + category where we have verified data. Fields are blank for
 * companies we haven't researched — the UI is responsible for hiding
 * empty fields rather than showing broken/empty buttons. */
let cachedCompanies: Company[] | null = null;

export function getCompanies(): Company[] {
  if (cachedCompanies) return cachedCompanies;

  const jobsBySlug = new Map<string, { name: string; internships: number; newGrad: number }>();
  for (const job of getJobs()) {
    const entry = jobsBySlug.get(job.companySlug) ?? {
      name: job.company,
      internships: 0,
      newGrad: 0,
    };
    if (job.type === "Internship") entry.internships += 1;
    else entry.newGrad += 1;
    jobsBySlug.set(job.companySlug, entry);
  }

  const bySlug = new Map<string, Company>();
  for (const [slug, counts] of jobsBySlug) {
    const enriched = enrichedBySlug.get(slug);
    bySlug.set(slug, {
      slug,
      name: counts.name,
      category: enriched?.category ?? "",
      officialCareers: enriched?.officialCareers ?? "",
      internships: enriched?.internships ?? "",
      newGrad: enriched?.newGrad ?? "",
      website: enriched?.website ?? "",
      hiringSeason: enriched?.hiringSeason ?? "",
      openInternshipRoles: counts.internships,
      openNewGradRoles: counts.newGrad,
    });
  }

  cachedCompanies = Array.from(bySlug.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return cachedCompanies;
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return getCompanies().find((c) => c.slug === slug);
}

export function getOpenRoleCount(slug: string): {
  internships: number;
  newGrad: number;
  total: number;
} {
  const jobs = getJobsForCompany(slug);
  const internships = jobs.filter((j) => j.type === "Internship").length;
  const newGrad = jobs.filter((j) => j.type === "New Grad").length;
  return { internships, newGrad, total: internships + newGrad };
}

export function getCategories(): string[] {
  const set = new Set<string>();
  for (const job of getJobs()) {
    for (const part of job.category.split(",")) {
      const trimmed = part.trim();
      if (trimmed) set.add(trimmed);
    }
  }
  return Array.from(set).sort();
}

export function jobMatchesCategory(job: Job, category: string): boolean {
  return job.category
    .split(",")
    .map((s) => s.trim())
    .includes(category);
}

export function getLocationBuckets(): LocationBucket[] {
  const set = new Set<LocationBucket>();
  for (const job of getJobs()) set.add(job.locationBucket);
  const order: LocationBucket[] = ["India", "International", "Remote"];
  return order.filter((b) => set.has(b));
}

export function getCompanyNamesWithJobs(): string[] {
  const set = new Set<string>();
  for (const job of getJobs()) set.add(job.company);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getResources(): Resource[] {
  return resourcesData as Resource[];
}

export function getResourceCategories(): string[] {
  const order = [
    "Startup Jobs",
    "General Jobs",
    "India",
    "International",
    "Government",
  ];
  const present = new Set(getResources().map((r) => r.category));
  return order.filter((c) => present.has(c));
}

export function getStats() {
  const jobs = getJobs();
  return {
    totalCompanies: getCompanies().length,
    totalJobs: jobs.length,
    totalInternships: jobs.filter((j) => j.type === "Internship").length,
    totalNewGrad: jobs.filter((j) => j.type === "New Grad").length,
  };
}
