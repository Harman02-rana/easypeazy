"use client";

import { useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { useLittleWins } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import EmptyState from "./EmptyState";

const TIMELINE_COLORS = [
  { text: "var(--cat-sister)", bg: "var(--cat-sister-bg)" },
  { text: "var(--cat-interview)", bg: "var(--cat-interview-bg)" },
  { text: "var(--cat-study)", bg: "var(--cat-study-bg)" },
  { text: "var(--cat-offer)", bg: "var(--cat-offer-bg)" },
  { text: "var(--cat-planner)", bg: "var(--cat-planner-bg)" },
  { text: "var(--cat-applications)", bg: "var(--cat-applications-bg)" },
];

export default function LittleWins() {
  const { items, hydrated, add, remove } = useLittleWins();
  const [text, setText] = useState("");

  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section>
      <h2 className="text-base font-semibold tracking-tight">Little wins</h2>
      <p className="mt-1 text-sm text-muted">
        Not everything worth celebrating is a big milestone. Jot down the small stuff too.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          add({
            id: generateId(),
            text: text.trim(),
            date: new Date().toISOString().slice(0, 10),
          });
          setText("");
        }}
        className="mt-3 flex flex-col gap-2 sm:flex-row"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Solved a tricky DSA problem, updated my resume..."
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>

      <div className="mt-4">
        {!hydrated ? null : items.length === 0 ? (
          <EmptyState
            title="No little wins recorded yet"
            description="Progress is happening even when it doesn't feel like it — write one down."
          />
        ) : (
          <div className="space-y-4 border-l-2 border-border pl-6">
            {sorted.map((w, i) => {
              const color = TIMELINE_COLORS[i % TIMELINE_COLORS.length];
              return (
                <div key={w.id} className="relative">
                  <span
                    className="absolute top-1 left-[-1.97rem] flex h-4 w-4 items-center justify-center rounded-full"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
                  </span>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-foreground">{w.text}</p>
                      <p className="mt-0.5 text-xs text-muted">{w.date}</p>
                    </div>
                    <button
                      onClick={() => remove(w.id)}
                      aria-label="Delete little win"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
