"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useTasks } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import { TASK_PRIORITIES } from "@/lib/trackerTypes";
import type { TaskPriority } from "@/lib/trackerTypes";
import EmptyState from "./EmptyState";

const PRIORITY_TINT: Record<TaskPriority, { text: string; bg: string }> = {
  High: { text: "var(--cat-interview)", bg: "var(--cat-interview-bg)" },
  Medium: { text: "var(--cat-planner)", bg: "var(--cat-planner-bg)" },
  Low: { text: "var(--cat-applications)", bg: "var(--cat-applications-bg)" },
};

function isOverdue(dueDate: string, status: string): boolean {
  if (!dueDate || status === "Done") return false;
  return dueDate < new Date().toISOString().slice(0, 10);
}

export default function TaskList() {
  const { items, hydrated, add, update, remove } = useTasks();
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");

  const sorted = [...items].sort((a, b) => {
    const aOverdue = isOverdue(a.dueDate, a.status);
    const bOverdue = isOverdue(b.dueDate, b.status);
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;
    if (a.status === "Done" && b.status !== "Done") return 1;
    if (b.status === "Done" && a.status !== "Done") return -1;
    return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
  });

  return (
    <section>
      <h2 className="text-base font-semibold tracking-tight">Quick tasks</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!task.trim()) return;
          add({
            id: generateId(),
            task: task.trim(),
            dueDate,
            priority,
            status: "To Do",
            createdAt: new Date().toISOString(),
          });
          setTask("");
          setDueDate("");
          setPriority("Medium");
        }}
        className="mt-3 flex flex-col gap-2 sm:flex-row"
      >
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        >
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="btn-primary"
        >
          Add
        </button>
      </form>

      <div className="mt-4">
        {!hydrated ? null : items.length === 0 ? (
          <EmptyState
            title="Nothing on your plate right now."
            description="Enjoy the breathing room. ☀️ Add something small whenever you're ready."
          />
        ) : (
          <div className="list-soft">
            {sorted.map((t) => {
              const overdue = isOverdue(t.dueDate, t.status);
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={t.status === "Done"}
                    onChange={(e) =>
                      update(t.id, {
                        status: e.target.checked ? "Done" : "To Do",
                      })
                    }
                    className="h-4 w-4 shrink-0 cursor-pointer accent-accent"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${
                        t.status === "Done"
                          ? "text-muted line-through"
                          : "text-foreground"
                      }`}
                    >
                      {t.task}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {t.dueDate || "No due date"}
                      {overdue && (
                        <span
                          className="pill ml-2"
                          style={{
                            backgroundColor: "var(--cat-rejected-bg)",
                            color: "var(--cat-rejected)",
                          }}
                        >
                          A little overdue
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className="badge shrink-0"
                    style={{ backgroundColor: PRIORITY_TINT[t.priority].bg, color: PRIORITY_TINT[t.priority].text }}
                  >
                    {t.priority}
                  </span>
                  <button
                    onClick={() => remove(t.id)}
                    aria-label="Delete task"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
