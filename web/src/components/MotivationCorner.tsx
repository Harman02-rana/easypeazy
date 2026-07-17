"use client";

import { useEffect, useState } from "react";
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
    <div className="flex items-center gap-2 border-t border-border pt-3 text-xs text-muted">
      <span className="font-medium text-foreground">A note from your sister</span>
      <span aria-hidden>·</span>
      <span>{message}</span>
    </div>
  );
}
