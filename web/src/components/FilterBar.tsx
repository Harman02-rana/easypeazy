"use client";

export interface FilterGroup {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export default function FilterBar({ groups }: { groups: FilterGroup[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {groups.map((group) => (
        <label key={group.label} className="flex flex-col gap-1 text-xs text-muted">
          {group.label}
          <select
            value={group.value}
            onChange={(e) => group.onChange(e.target.value)}
            className="min-w-[10rem] rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent"
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
    </div>
  );
}
