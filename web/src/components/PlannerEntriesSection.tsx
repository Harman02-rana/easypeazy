"use client";

import { useMemo, useState } from "react";
import { usePlannerEntries } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import { PLANNER_CATEGORIES } from "@/lib/trackerTypes";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import PlannerEntryForm, { type PlannerEntryDraft } from "./PlannerEntryForm";
import PlannerEntry from "./PlannerEntry";
import EmptyState from "./EmptyState";

function monthOf(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function PlannerEntriesSection() {
  const { items, hydrated, add, update, remove } = usePlannerEntries();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  const [creating, setCreating] = useState(false);

  const months = useMemo(
    () =>
      Array.from(new Set(items.map((e) => monthOf(e.date)))).sort((a, b) =>
        b.localeCompare(a)
      ),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((e) => {
        const matchesQuery =
          !q ||
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = !category || e.category === category;
        const matchesMonth = !month || monthOf(e.date) === month;
        return matchesQuery && matchesCategory && matchesMonth;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [items, query, category, month]);

  function draftToEntry(draft: PlannerEntryDraft) {
    return {
      title: draft.title.trim(),
      date: draft.date,
      content: draft.content.trim(),
      category: draft.category,
      tags: draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">Journal entries</h2>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="btn-tactile rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            New entry
          </button>
        )}
      </div>

      {creating && (
        <div className="mt-3">
          <PlannerEntryForm
            onSave={(draft) => {
              const now = new Date().toISOString();
              add({
                id: generateId(),
                ...draftToEntry(draft),
                createdAt: now,
                updatedAt: now,
              });
              setCreating(false);
            }}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      {hydrated && items.length > 0 && (
        <div className="mt-4 space-y-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search entries..."
          />
          <FilterBar
            groups={[
              {
                label: "Category",
                value: category,
                onChange: setCategory,
                options: PLANNER_CATEGORIES.map((c) => ({ label: c, value: c })),
              },
              {
                label: "Month",
                value: month,
                onChange: setMonth,
                options: months.map((m) => ({ label: monthLabel(m), value: m })),
              },
            ]}
          />
        </div>
      )}

      <div className="mt-4">
        {!hydrated ? null : items.length === 0 ? (
          <EmptyState
            title="Your notebook is empty for now 📝"
            description="Start with a quick daily plan or a career goal — whatever's on your mind."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Nothing matches"
            description="Try a different search or clear a filter."
          />
        ) : (
          <div className="list-soft px-4">
            {filtered.map((entry) => (
              <PlannerEntry
                key={entry.id}
                entry={entry}
                onUpdate={(draft) =>
                  update(entry.id, {
                    ...draftToEntry(draft),
                    updatedAt: new Date().toISOString(),
                  })
                }
                onDelete={() => remove(entry.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
