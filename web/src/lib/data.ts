import companiesData from "../../data/companies.json";
import jobsData from "../../data/jobs.json";
import type { Company, Job } from "./types";

export function getCompanies(): Company[] {
  return companiesData as Company[];
}

export function getJobs(): Job[] {
  return jobsData as Job[];
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return getCompanies().find((c) => c.slug === slug);
}

export function getJobsForCompany(slug: string): Job[] {
  return getJobs().filter((j) => j.companySlug === slug);
}

export function getCategories(): string[] {
  const set = new Set<string>();
  for (const c of getCompanies()) {
    if (!c.category) continue;
    for (const part of c.category.split(",")) {
      const trimmed = part.trim();
      if (trimmed) set.add(trimmed);
    }
  }
  return Array.from(set).sort();
}

export function companyMatchesCategory(company: Company, category: string): boolean {
  if (!company.category) return false;
  return company.category.split(",").map((s) => s.trim()).includes(category);
}

export function getTotalOpenRoles(company: Company): number {
  return company.openInternshipRoles + company.openNewGradRoles;
}
