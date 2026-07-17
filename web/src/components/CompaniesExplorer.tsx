"use client";

import { useMemo, useState } from "react";
import type { Company } from "@/lib/types";
import SearchBar from "./SearchBar";
import CompanyCard from "./CompanyCard";
import EmptyState from "./EmptyState";

export default function CompaniesExplorer({
  companies,
}: {
  companies: Company[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [companies, query]);

  return (
    <div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search companies or categories..."
        large
      />

      <p className="mt-4 text-sm text-muted">
        {filtered.length} compan{filtered.length === 1 ? "y" : "ies"}
      </p>

      <div className="mt-3">
        {filtered.length === 0 ? (
          <EmptyState
            title="No companies match yet"
            description="Try a different search term."
          />
        ) : (
          <div className="list-soft">
            {filtered.map((company) => (
              <CompanyCard key={company.slug} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
