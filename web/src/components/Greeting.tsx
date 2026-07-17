"use client";

import { useEffect, useState } from "react";
import { BROTHER_NAME } from "@/lib/personalConfig";

function greetingForHour(hour: number): string {
  if (hour < 12) return `Good morning, ${BROTHER_NAME} ☀️`;
  if (hour < 18) return `Good afternoon, ${BROTHER_NAME} 👋`;
  return `Good evening, ${BROTHER_NAME} 🌙`;
}

export default function Greeting() {
  // Computed client-side only (in an effect) so the greeting reflects the
  // visitor's actual local time rather than the server's — matches the
  // pattern already used for the daily-rotating sister note.
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    setGreeting(greetingForHour(new Date().getHours()));
  }, []);

  return (
    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
      {greeting ?? `Hey ${BROTHER_NAME} 👋`}
    </h1>
  );
}
