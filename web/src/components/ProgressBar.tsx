"use client";

import { useEffect, useRef, useState } from "react";

function encouragingMessage(value: number): string {
  if (value >= 100) return "Done! You crushed this 🎉";
  if (value >= 81) return "Almost there!";
  if (value >= 61) return "You're getting there.";
  if (value >= 41) return "Look how far you've come!";
  if (value >= 21) return "You're building momentum.";
  return "Every journey starts somewhere 🌱";
}

export default function ProgressBar({
  value,
  label,
  showMessage = false,
}: {
  value: number;
  label?: string;
  /** Shows a small encouraging line under the bar — used sparingly, only
   * where a message genuinely helps (e.g. the main overview), not on every
   * tiny bar throughout the app. */
  showMessage?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));

  // Animate the fill growing in from 0 on first mount, so a freshly-loaded
  // page reads as "alive" rather than the bar just appearing pre-filled.
  // Later value changes (e.g. dragging the goal-progress slider) still
  // animate via the CSS transition below, just without the initial delay.
  const [display, setDisplay] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      const frame = requestAnimationFrame(() => setDisplay(clamped));
      return () => cancelAnimationFrame(frame);
    }
    setDisplay(clamped);
  }, [clamped]);

  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full border border-border bg-surface-hover">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${display}%` }}
        />
      </div>
      {showMessage && (
        <p className="mt-1.5 text-xs text-muted">{encouragingMessage(clamped)}</p>
      )}
    </div>
  );
}
