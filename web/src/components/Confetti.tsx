"use client";

import { useMemo } from "react";

const COLORS = ["#a8541f", "#d98a4e", "#33633a", "#726a61", "#c2703d"];
const PIECE_COUNT = 28;

/** A light, CSS-only confetti burst — no external dependency. Used sparingly,
 * only for major milestones and the first-offer celebration. */
export default function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1.6 + Math.random() * 0.9,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
        size: 5 + Math.random() * 4,
      })),
    []
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-56 overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece absolute top-0 rounded-sm"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
