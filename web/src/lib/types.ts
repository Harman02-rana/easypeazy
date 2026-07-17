export interface Company {
  slug: string;
  name: string;
  category: string;
  officialCareers: string;
  internships: string;
  newGrad: string;
  website: string;
  hiringSeason: string;
  openInternshipRoles: number;
  openNewGradRoles: number;
}

export type LocationBucket = "India" | "International" | "Remote";

export interface Job {
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
  category: string;
  locationBucket: LocationBucket;
}

export interface Resource {
  name: string;
  category: string;
  description: string;
  url: string;
}
