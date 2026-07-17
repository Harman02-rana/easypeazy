"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/types";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import JobList from "./JobList";

export default function IndiaExplorer({
  jobs,
  categories,
  companyNames,
}: {
  jobs: Job[];
  categories: string[];
  companyNames: string[];
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
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
      const matchesCategory =
        !category ||
        job.category.split(",").map((s) => s.trim()).includes(category);
      const matchesCompany = !company || job.company === company;
      return matchesQuery && matchesType && matchesCategory && matchesCompany;
    });
  }, [jobs, query, type, category, company]);

  return (
    <div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search companies, roles, or cities..."
        large
      />

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
