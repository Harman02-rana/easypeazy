"use client";

import { useEffect } from "react";
import type { Celebration } from "@/lib/milestoneLogic";
import Confetti from "./Confetti";

export default function MilestoneCelebration({
  celebration,
  onClose,
}: {
  celebration: Celebration;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="celebration-in relative w-full max-w-sm overflow-hidden rounded-lg border border-border bg-background p-6 text-center shadow-lg"
      >
        {celebration.confetti && <Confetti />}

        <h2 className="relative text-lg font-semibold tracking-tight text-foreground">
          {celebration.title}
        </h2>

        {celebration.message && (
          <p className="relative mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
            {celebration.message}
          </p>
        )}

        {celebration.showSignature && (
          <p className="relative mt-3 text-xs text-muted">From your sister ❤️</p>
        )}

        <button
          onClick={onClose}
          className="relative mt-5 w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
        >
          Keep Going
        </button>
      </div>
    </div>
  );
}
