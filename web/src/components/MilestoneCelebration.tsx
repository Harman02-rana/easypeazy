"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import type { Celebration } from "@/lib/milestoneLogic";
import Confetti from "./Confetti";
import CelebrationParticles from "./CelebrationParticles";

type ParticleVariant = "single-sparkle" | "sparkle-burst" | "stars" | "hearts" | "confetti-hearts" | "none";

interface Visual {
  accent: string;
  accentBg: string;
  particle: ParticleVariant;
  big: boolean;
}

function getVisual(c: Celebration): Visual {
  if (c.kind === "first-offer") {
    return { accent: "var(--cat-offer)", accentBg: "var(--cat-offer-bg)", particle: "confetti-hearts", big: true };
  }
  if (c.kind === "first-application") {
    return { accent: "var(--cat-applications)", accentBg: "var(--cat-applications-bg)", particle: "single-sparkle", big: false };
  }
  if (c.kind === "first-oa") {
    return { accent: "var(--cat-study)", accentBg: "var(--cat-study-bg)", particle: "single-sparkle", big: false };
  }
  if (c.kind === "first-interview") {
    return { accent: "var(--cat-interview)", accentBg: "var(--cat-interview-bg)", particle: "single-sparkle", big: false };
  }

  const n = c.milestoneNumber ?? 0;
  if (n === 5) {
    return { accent: "var(--cat-applications)", accentBg: "var(--cat-applications-bg)", particle: "single-sparkle", big: false };
  }
  if (n === 10) {
    return { accent: "var(--cat-interview)", accentBg: "var(--cat-interview-bg)", particle: "sparkle-burst", big: false };
  }
  if (n === 15) {
    return { accent: "var(--cat-study)", accentBg: "var(--cat-study-bg)", particle: "stars", big: false };
  }
  if (n === 20) {
    return { accent: "var(--cat-sister)", accentBg: "var(--cat-sister-bg)", particle: "hearts", big: false };
  }
  if (n === 25) {
    return { accent: "var(--cat-sister)", accentBg: "var(--cat-sister-bg)", particle: "confetti-hearts", big: true };
  }

  // Rotating pool past 25 (30, 35, ...): cycle the same four accents so the
  // popup still feels intentional, and reserve confetti for the major
  // 50/100 thresholds already flagged via `confetti`.
  const cycle = [
    { accent: "var(--cat-applications)", accentBg: "var(--cat-applications-bg)" },
    { accent: "var(--cat-interview)", accentBg: "var(--cat-interview-bg)" },
    { accent: "var(--cat-study)", accentBg: "var(--cat-study-bg)" },
    { accent: "var(--cat-sister)", accentBg: "var(--cat-sister-bg)" },
  ];
  const palette = cycle[Math.floor(n / 5) % cycle.length];
  return { ...palette, particle: c.confetti ? "confetti-hearts" : "single-sparkle", big: c.confetti };
}

function hypeLine(c: Celebration): string {
  switch (c.kind) {
    case "first-offer":
      return "Something amazing just happened...";
    case "first-application":
      return "Something just happened! ✨";
    case "first-oa":
      return "Look at that! ✨";
    case "first-interview":
      return "Whoa, look at you! ✨";
    default:
      return "You just hit another milestone! ✨";
  }
}

function closeLabel(c: Celebration): string {
  if (c.kind === "first-offer") return "Let's celebrate 🎉";
  if (c.kind === "milestone" && (c.milestoneNumber ?? 0) >= 25) return "On to the next one 🚀";
  return "Okay, let's keep going ❤️";
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function MilestoneCelebration({
  celebration,
  onClose,
}: {
  celebration: Celebration;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Staged reveal: "Wait a second..." -> hype line -> sister-note header ->
  // message. Reduced motion skips straight to the final state.
  useEffect(() => {
    if (reducedMotion) {
      setStep(4);
      return;
    }
    const timers = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 300 + 450),
      setTimeout(() => setStep(3), 300 + 450 + 400),
      setTimeout(() => setStep(4), 300 + 450 + 400 + 350),
    ];
    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  // Focus trap + Escape-to-close + restore focus to whatever was focused
  // before the popup opened. Clicking the backdrop deliberately does
  // nothing — these celebrations shouldn't be dismissable by accident.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;

    const focusable = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
    focusable()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const items = focusable();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const visual = getVisual(celebration);
  const showConfetti = (visual.particle === "confetti-hearts" || celebration.confetti) && !reducedMotion;
  const showHearts = visual.particle === "hearts" && !reducedMotion && step >= 3;
  const showStars = visual.particle === "stars" && !reducedMotion && step >= 3;
  const showSparkleBurst = visual.particle === "sparkle-burst" && !reducedMotion && step >= 3;

  return (
    <div
      className="backdrop-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebration-title"
        onClick={(e) => e.stopPropagation()}
        className={`popup-spring-in relative w-full overflow-hidden rounded-3xl text-center shadow-xl ${
          visual.big ? "max-w-md p-8" : "max-w-sm p-7"
        }`}
        style={{
          border: `1px solid ${visual.accent}`,
          background: `linear-gradient(160deg, ${visual.accentBg} 0%, var(--cat-planner-bg) 100%)`,
          maxHeight: "min(88vh, 640px)",
          overflowY: "auto",
        }}
      >
        {showConfetti && <Confetti />}
        {showHearts && <CelebrationParticles variant="hearts" />}
        {showStars && <CelebrationParticles variant="stars" />}
        {showSparkleBurst && <CelebrationParticles variant="sparkle" count={7} />}

        <div className="relative flex min-h-40 flex-col items-center justify-center">
          {step === 0 && <div className="h-6" />}

          {step === 1 && (
            <p className="step-fade-in text-sm text-muted">Wait a second...</p>
          )}

          {step === 2 && (
            <p className="step-fade-in text-base font-medium text-foreground">
              {hypeLine(celebration)}
            </p>
          )}

          {step >= 3 && (
            <div className="step-fade-in w-full">
              <div className="flex items-center justify-center gap-1.5">
                {visual.particle === "single-sparkle" ? (
                  <Sparkles className="sparkle-pop h-4 w-4" style={{ color: visual.accent }} strokeWidth={2} />
                ) : (
                  <Heart className="h-3.5 w-3.5" style={{ color: visual.accent }} strokeWidth={2} fill={visual.accent} />
                )}
                <span className="text-xs font-semibold" style={{ color: visual.accent }}>
                  A little note from your sister ❤️
                </span>
              </div>

              <h2
                id="celebration-title"
                className="mt-2 text-lg font-semibold tracking-tight text-foreground"
              >
                {celebration.title}
              </h2>

              {step >= 4 && celebration.message && (
                <p className="step-fade-in mt-4 whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">
                  {celebration.message}
                </p>
              )}
            </div>
          )}
        </div>

        {step >= 3 && (
          <button onClick={onClose} className="btn-primary relative mt-6 w-full">
            {closeLabel(celebration)}
          </button>
        )}
      </div>
    </div>
  );
}
