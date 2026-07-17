"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function HomeSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/jobs?q=${encodeURIComponent(q)}` : "/jobs");
      }}
    >
      <SearchBar
        value={value}
        onChange={setValue}
        placeholder="Search companies, roles, or locations..."
        large
      />
    </form>
  );
}
