"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/types";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import JobList from "./JobList";

export default function JobsExplorer({
  jobs,
  categories,
  locationBuckets,
  companyNames,
  initialQuery = "",
  initialType = "",
  initialCategory = "",
}: {
  jobs: Job[];
  categories: string[];
  locationBuckets: string[];
  companyNames: string[];
  initialQuery?: string;
  initialType?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [company, setCompany] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesQuery =
        !q ||
        job.company.toLowerCase().includes(q) ||
        job.position.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);
      const matchesType = !type || job.type === type;
      const matchesLocation = !location || job.locationBucket === location;
      const matchesCategory =
        !category ||
        job.category.split(",").map((s) => s.trim()).includes(category);
      const matchesCompany = !company || job.company === company;
      return (
        matchesQuery &&
        matchesType &&
        matchesLocation &&
        matchesCategory &&
        matchesCompany
      );
    });
  }, [jobs, query, type, location, category, company]);

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} large />

      <div className="mt-4">
        <FilterBar
          groups={[
            {
              label: "Job Type",
              value: type,
              onChange: setType,
              options: [
                { label: "New Grad", value: "New Grad" },
                { label: "Internship", value: "Internship" },
              ],
            },
            {
              label: "Location",
              value: location,
              onChange: setLocation,
              options: locationBuckets.map((b) => ({ label: b, value: b })),
            },
            {
              label: "Category",
              value: category,
              onChange: setCategory,
              options: categories.map((c) => ({ label: c, value: c })),
            },
            {
              label: "Company",
              value: company,
              onChange: setCompany,
              options: companyNames.map((c) => ({ label: c, value: c })),
            },
          ]}
          onClear={() => {
            setType("");
            setLocation("");
            setCategory("");
            setCompany("");
          }}
        />
      </div>

      <p className="mt-4 text-sm font-medium text-foreground">
        {filtered.length} opportunit{filtered.length === 1 ? "y" : "ies"} found
      </p>

      <div className="mt-3">
        <JobList jobs={filtered} />
      </div>
    </div>
  );
}
