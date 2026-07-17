"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavbarSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function submit() {
    const q = value.trim();
    router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs");
  }

  return (
    <div className="flex items-center">
      {open ? (
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") setOpen(false);
          }}
          onBlur={() => {
            if (!value) setOpen(false);
          }}
          placeholder="Search jobs..."
          className="w-40 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-accent sm:w-56"
        />
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Search"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="h-4.5 w-4.5"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
          </svg>
        </button>
      )}
    </div>
  );
}
