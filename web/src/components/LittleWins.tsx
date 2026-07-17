"use client";

import { useState } from "react";
import { useLittleWins } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import EmptyState from "./EmptyState";

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
        <button
          type="submit"
          className="btn-tactile rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
        >
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
          <ul className="space-y-2">
            {sorted.map((w) => (
              <li
                key={w.id}
                className="card-soft flex items-center justify-between gap-3 p-3"
                style={{ backgroundColor: "var(--cat-sister-bg)" }}
              >
                <span className="text-sm text-foreground">✨ {w.text}</span>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-muted">{w.date}</span>
                  <button
                    onClick={() => remove(w.id)}
                    className="text-xs text-muted transition-colors hover:text-foreground cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
