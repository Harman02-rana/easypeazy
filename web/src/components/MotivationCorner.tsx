"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { motivationCornerMessageForToday } from "@/lib/milestoneMessages";

export default function MotivationCorner() {
  // Computed in an effect (not directly at module scope) purely so the
  // server-rendered markup and first client paint match exactly — the
  // value itself only depends on today's date, not on anything
  // browser-only, so there's no real hydration risk either way.
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setMessage(motivationCornerMessageForToday());
  }, []);

  if (!message) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-5"
      style={{
        borderColor: "var(--cat-sister)",
        background: "linear-gradient(155deg, var(--cat-sister-bg) 0%, var(--cat-planner-bg) 100%)",
      }}
    >
      <Quote
        className="absolute -right-2 -top-2 h-16 w-16 opacity-15"
        style={{ color: "var(--cat-sister)" }}
        strokeWidth={1.5}
        fill="var(--cat-sister)"
      />
      <p className="relative text-[15px] italic leading-relaxed text-foreground/90">
        &ldquo;{message}&rdquo;
      </p>
    </div>
  );
}
