"use client";

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted ${
          large ? "h-4.5 w-4.5" : "h-4 w-4"
        }`}
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-border bg-surface text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent ${
          large ? "py-3 pl-11 pr-4 text-[15px]" : "py-2 pl-9 pr-3 text-sm"
        }`}
      />
    </div>
  );
}
