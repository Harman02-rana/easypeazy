"use client";

import { useState } from "react";
import { PREP_CATEGORIES, ROADMAP_MONTHS, TOPIC_STATUSES, formatMonth } from "@/lib/trackerTypes";
import type { PrepCategory, StudyTopic, TopicStatus } from "@/lib/trackerTypes";

export type TopicDraft = Omit<StudyTopic, "id">;

function toDraft(topic?: StudyTopic, defaultCategory?: PrepCategory): TopicDraft {
  if (topic) {
    const { id: _id, ...rest } = topic;
    void _id;
    return rest;
  }
  return {
    topic: "",
    category: defaultCategory ?? "DSA",
    status: "Not Started",
    progress: 0,
    targetMonth: ROADMAP_MONTHS[0],
    questionsTarget: 0,
    questionsCompleted: 0,
    resourceName: "",
    resourceUrl: "",
    notes: "",
  };
}

export default function TopicForm({
  topic,
  defaultCategory,
  onSave,
  onCancel,
}: {
  topic?: StudyTopic;
  defaultCategory?: PrepCategory;
  onSave: (draft: TopicDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<TopicDraft>(toDraft(topic, defaultCategory));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.topic.trim()) return;
        onSave(draft);
      }}
      className="card-soft space-y-3 p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Topic
          <input
            value={draft.topic}
            onChange={(e) => setDraft({ ...draft, topic: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            autoFocus
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Category
          <select
            value={draft.category}
            onChange={(e) =>
              setDraft({ ...draft, category: e.target.value as PrepCategory })
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            {PREP_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Status
          <select
            value={draft.status}
            onChange={(e) => {
              const status = e.target.value as TopicStatus;
              setDraft({
                ...draft,
                status,
                progress:
                  status === "Completed"
                    ? 100
                    : status === "Not Started"
                      ? 0
                      : draft.progress,
              });
            }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            {TOPIC_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Progress %
          <input
            type="number"
            min={0}
            max={100}
            value={draft.progress}
            onChange={(e) =>
              setDraft({ ...draft, progress: Number(e.target.value) })
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Target month
          <select
            value={draft.targetMonth}
            onChange={(e) => setDraft({ ...draft, targetMonth: e.target.value })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            {ROADMAP_MONTHS.map((m) => (
              <option key={m} value={m}>
                {formatMonth(m)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs text-muted">
          Questions target
          <input
            type="number"
            min={0}
            value={draft.questionsTarget}
            onChange={(e) =>
              setDraft({ ...draft, questionsTarget: Number(e.target.value) })
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Questions completed
          <input
            type="number"
            min={0}
            value={draft.questionsCompleted}
            onChange={(e) =>
              setDraft({ ...draft, questionsCompleted: Number(e.target.value) })
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs text-muted sm:col-span-1">
          Resource name
          <input
            value={draft.resourceName}
            onChange={(e) => setDraft({ ...draft, resourceName: e.target.value })}
            placeholder="Optional"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-xs text-muted sm:col-span-1">
          Resource URL
          <input
            value={draft.resourceUrl}
            onChange={(e) => setDraft({ ...draft, resourceUrl: e.target.value })}
            placeholder="Optional"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Notes
        <textarea
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          rows={3}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="btn-primary"
        >
          {topic ? "Save changes" : "Add topic"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
