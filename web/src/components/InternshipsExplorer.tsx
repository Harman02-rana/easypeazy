"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/types";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import JobList from "./JobList";

export default function InternshipsExplorer({
  internships,
  locationBuckets,
  companyNames,
}: {
  internships: Job[];
  locationBuckets: string[];
  companyNames: string[];
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return internships.filter((job) => {
      const matchesQuery =
        !q ||
        job.company.toLowerCase().includes(q) ||
        job.position.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);
      const matchesLocation = !location || job.locationBucket === location;
      const matchesCompany = !company || job.company === company;
      return matchesQuery && matchesLocation && matchesCompany;
    });
  }, [internships, query, location, company]);

  return (
    <div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search internships, companies, or locations..."
        large
      />

      <div className="mt-4">
        <FilterBar
          groups={[
            {
              label: "Location",
              value: location,
              onChange: setLocation,
              options: locationBuckets.map((b) => ({ label: b, value: b })),
            },
            {
              label: "Company",
              value: company,
              onChange: setCompany,
              options: companyNames.map((c) => ({ label: c, value: c })),
            },
          ]}
          onClear={() => {
            setLocation("");
            setCompany("");
          }}
        />
      </div>

      <p className="mt-4 text-sm font-medium text-foreground">
        {filtered.length} internship{filtered.length === 1 ? "" : "s"} found
      </p>

      <div className="mt-3">
        <JobList jobs={filtered} />
      </div>
    </div>
  );
}
