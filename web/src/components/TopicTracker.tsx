"use client";

import { useState } from "react";
import { useStudyTopics } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import { PREP_CATEGORIES } from "@/lib/trackerTypes";
import type { StudyTopic } from "@/lib/trackerTypes";
import TopicForm, { type TopicDraft } from "./TopicForm";
import ProgressBar from "./ProgressBar";
import EmptyState from "./EmptyState";

function TopicRow({
  topic,
  onUpdate,
  onDelete,
}: {
  topic: StudyTopic;
  onUpdate: (draft: TopicDraft) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="border-b border-border py-3 last:border-b-0">
        <TopicForm
          topic={topic}
          onSave={(draft) => {
            onUpdate(draft);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-foreground">{topic.topic}</span>
          <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted">
            {topic.status}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-3">
          <div className="w-32">
            <ProgressBar value={topic.progress} />
          </div>
          {topic.questionsTarget > 0 && (
            <span className="text-xs text-muted">
              {topic.questionsCompleted}/{topic.questionsTarget} questions
            </span>
          )}
          {topic.resourceUrl && (
            <a
              href={topic.resourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              {topic.resourceName || "Resource"} ↗
            </a>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-2 text-xs">
        <button
          onClick={() => setEditing(true)}
          className="rounded-lg border border-border px-2.5 py-1 font-medium text-foreground transition-colors hover:bg-surface-hover cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg border border-border px-2.5 py-1 font-medium text-muted transition-colors hover:bg-surface-hover cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function TopicTracker() {
  const { items, hydrated, add, update, remove } = useStudyTopics();
  const [creating, setCreating] = useState(false);

  const grouped = PREP_CATEGORIES.map((category) => ({
    category,
    topics: items.filter((t) => t.category === category),
  })).filter((g) => g.topics.length > 0);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">Study topics</h2>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            Add topic
          </button>
        )}
      </div>

      {creating && (
        <div className="mt-3">
          <TopicForm
            onSave={(draft) => {
              add({ id: generateId(), ...draft });
              setCreating(false);
            }}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      <div className="mt-4">
        {!hydrated ? null : grouped.length === 0 ? (
          <EmptyState
            title="No topics yet"
            description="Add your first preparation topic to start tracking progress."
          />
        ) : (
          <div className="space-y-6">
            {grouped.map(({ category, topics }) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted">{category}</h3>
                <div className="mt-2 rounded-lg border border-border bg-surface px-4">
                  {topics.map((topic) => (
                    <TopicRow
                      key={topic.id}
                      topic={topic}
                      onUpdate={(draft) => update(topic.id, draft)}
                      onDelete={() => remove(topic.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
