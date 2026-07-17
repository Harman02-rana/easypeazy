"use client";

import { SlidersHorizontal, X } from "lucide-react";

export interface FilterGroup {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export default function FilterBar({
  groups,
  onClear,
}: {
  groups: FilterGroup[];
  /** Shows a "Clear filters" action when at least one group has a value. */
  onClear?: () => void;
}) {
  const anyActive = groups.some((g) => g.value);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <span className="mb-2 hidden h-4 w-4 shrink-0 text-muted sm:inline-flex">
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
      </span>
      {groups.map((group) => (
        <label key={group.label} className="flex flex-col gap-1 text-xs text-muted">
          {group.label}
          <select
            value={group.value}
            onChange={(e) => group.onChange(e.target.value)}
            className="min-w-38 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent-soft-bg"
          >
            <option value="">All</option>
            {group.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      {onClear && anyActive && (
        <button
          onClick={onClear}
          className="btn-secondary-sm mb-0.5 cursor-pointer"
        >
          <X className="h-3 w-3" strokeWidth={2.25} />
          Clear filters
        </button>
      )}
    </div>
  );
}
