"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

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
          <Search className="h-4.5 w-4.5" strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}
