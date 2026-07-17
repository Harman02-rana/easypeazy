"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { store } from "@/lib/storage";
import {
  WELCOME_NOTE_BUTTON_LABEL,
  WELCOME_NOTE_PARAGRAPHS,
  WELCOME_NOTE_TITLE,
} from "@/lib/welcomeNote";

const WELCOME_SEEN_KEY = "jhp_welcome_note_seen";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function WelcomeNote() {
  const [show, setShow] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Checked in an effect (client-only) so the very first paint on both
  // server and client renders nothing, then this either stays hidden or
  // appears once — never a hydration mismatch either way.
  useEffect(() => {
    if (!store.getItem<boolean>(WELCOME_SEEN_KEY)) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    store.setItem(WELCOME_SEEN_KEY, true);
    setShow(false);
  }

  // Focus trap + Escape-to-close + restore focus on close, same pattern as
  // the milestone celebration popup. No accidental dismissal on backdrop
  // click — this is meant to be read, not swiped past.
  useEffect(() => {
    if (!show) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focusable = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
    // `preventScroll` matters here specifically: the only focusable element
    // is the button at the very bottom of a long, internally-scrollable
    // letter, so a normal .focus() call would immediately scroll straight
    // to it — opening on the button instead of "Hey Aditya,". Also force
    // the scroll container back to the top defensively.
    focusable()[0]?.focus({ preventScroll: true });
    if (scrollRef.current) scrollRef.current.scrollTop = 0;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        dismiss();
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
  }, [show]);

  if (!show) return null;

  return (
    <div
      className="backdrop-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-note-title"
        onClick={(e) => e.stopPropagation()}
        className="popup-spring-in relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border shadow-xl"
        style={{
          borderColor: "var(--cat-sister)",
          background: "linear-gradient(165deg, var(--cat-sister-bg) 0%, var(--cat-planner-bg) 55%, var(--surface) 100%)",
        }}
      >
        <div ref={scrollRef} className="overflow-y-auto px-7 py-8 sm:px-9 sm:py-9">
          <Heart
            className="mx-auto h-6 w-6"
            style={{ color: "var(--cat-sister)" }}
            strokeWidth={2}
            fill="var(--cat-sister)"
          />

          <h2
            id="welcome-note-title"
            className="mt-3 text-center text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            {WELCOME_NOTE_TITLE}
          </h2>

          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-foreground/90">
            {WELCOME_NOTE_PARAGRAPHS.map((p, i) => (
              <p key={i} className={i === 0 ? "text-base font-medium text-foreground" : undefined}>
                {p}
              </p>
            ))}
          </div>

          <button onClick={dismiss} className="btn-primary relative mt-7 w-full">
            {WELCOME_NOTE_BUTTON_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
