"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  large?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search companies, roles, or locations...",
  large = false,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted ${
          large ? "h-4.5 w-4.5" : "h-4 w-4"
        }`}
        strokeWidth={1.75}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-border bg-surface text-foreground outline-none transition-all placeholder:text-muted focus:border-accent focus:ring-4 focus:ring-accent-soft-bg ${
          large ? "py-3 pl-11 pr-4 text-[15px]" : "py-2 pl-9 pr-3 text-sm"
        }`}
      />
    </div>
  );
}
