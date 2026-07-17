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
        className="celebration-in relative w-full max-w-sm overflow-hidden rounded-2xl p-6 text-center shadow-lg"
        style={{
          border: "1px solid var(--cat-sister)",
          background:
            "linear-gradient(160deg, var(--cat-sister-bg) 0%, var(--cat-interview-bg) 100%)",
        }}
      >
        {celebration.confetti && <Confetti />}

        <span className="relative block text-2xl">💌</span>

        <h2 className="relative mt-2 text-lg font-semibold tracking-tight text-foreground">
          {celebration.title}
        </h2>

        {celebration.message && (
          <p className="relative mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
            {celebration.message}
          </p>
        )}

        {celebration.showSignature && (
          <p
            className="relative mt-3 text-xs font-medium"
            style={{ color: "var(--cat-sister)" }}
          >
            A little note from your sister ❤️
          </p>
        )}

        <button
          onClick={onClose}
          className="btn-tactile relative mt-5 w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
        >
          Keep Going
        </button>
      </div>
    </div>
  );
}
