"use client";

import { useMemo, useState } from "react";
import type { Company } from "@/lib/types";
import CompanyCard from "./CompanyCard";

export default function CompanyExplorer({
  companies,
  categories,
}: {
  companies: Company[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => {
      const matchesQuery = !q || c.name.toLowerCase().includes(q);
      const matchesCategory =
        !activeCategory ||
        c.category
          .split(",")
          .map((s) => s.trim())
          .includes(activeCategory);
      return matchesQuery && matchesCategory;
    });
  }, [companies, query, activeCategory]);

  return (
    <div id="companies" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Browse {companies.length} companies
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Search by name or filter by category to find where to apply next.
          </p>
        </div>

        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, e.g. Google, NVIDIA, Stripe..."
            className="w-full rounded-full border border-border bg-surface py-3.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              activeCategory === null
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-muted hover:border-border-strong hover:text-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted hover:border-border-strong hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="text-sm text-muted">
            No companies match &ldquo;{query}&rdquo;. Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((company) => (
            <CompanyCard key={company.slug} company={company} />
          ))}
        </div>
      )}
    </div>
  );
}
