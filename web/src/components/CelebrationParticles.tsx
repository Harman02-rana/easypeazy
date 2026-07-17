"use client";

import { useMemo } from "react";

const GLYPHS: Record<"sparkle" | "stars" | "hearts", string[]> = {
  sparkle: ["✨"],
  stars: ["✦", "✧", "⋆"],
  hearts: ["❤", "💗"],
};

/** A handful of small emoji particles that drift up and fade — used for the
 * milestone popup only, never elsewhere. Pure decoration: `aria-hidden`,
 * `pointer-events-none`, and gone well before anyone could try to interact
 * with them. */
export default function CelebrationParticles({
  variant,
  count = 9,
}: {
  variant: "sparkle" | "stars" | "hearts";
  count?: number;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const glyphs = GLYPHS[variant];
        return {
          id: i,
          left: 6 + Math.random() * 88,
          bottom: Math.random() * 40,
          delay: Math.random() * 0.7,
          duration: 1.3 + Math.random() * 1.1,
          size: 12 + Math.random() * 10,
          glyph: glyphs[i % glyphs.length],
        };
      }),
    [variant, count]
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-float"
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            fontSize: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.glyph}
        </span>
      ))}
    </div>
  );
}
