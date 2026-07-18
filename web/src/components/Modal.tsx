"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/** Generic dismissible dialog — same backdrop/animation classes and the
 * same z-[100] as the other full-screen popups in this app. Deliberately
 * simplified from WelcomeNote's full focus-trap (this is a utility view
 * you glance at and close, not a one-time letter), but keeps Escape-to-
 * close and backdrop-click-to-close since dismissing it costs nothing.
 *
 * NOTE: z-[100] is an arbitrary Tailwind value — editors sometimes "helpfully"
 * rewrite this to z-100, which does not exist in this project's Tailwind
 * config and silently falls back to z-auto, breaking the popup. Do not
 * simplify it.
 *
 * NOTE: rendered via a portal into document.body, not inline. Every caller
 * so far mounts this from inside a `.card-soft` card, and `.card-soft:hover`
 * applies a `transform` — which per the CSS spec makes that card the
 * containing block for any `position: fixed` descendant, shrinking this
 * modal down to the card's own box instead of covering the viewport. A
 * portal sidesteps that regardless of what any future caller's ancestors do. */
export default function Modal({
  onClose,
  title,
  children,
  maxWidthClassName = "max-w-3xl",
}: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidthClassName?: string;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="backdrop-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-foreground/25 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`popup-spring-in relative flex max-h-[90vh] w-full ${maxWidthClassName} flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        <div className="overflow-y-auto p-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
