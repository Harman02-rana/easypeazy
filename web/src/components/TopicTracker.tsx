"use client";

import { useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useStudyTopics } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import { PREP_CATEGORIES } from "@/lib/trackerTypes";
import type { StudyTopic } from "@/lib/trackerTypes";
import TopicForm, { type TopicDraft } from "./TopicForm";
import ProgressBar from "./ProgressBar";
import EmptyState from "./EmptyState";

function StatusBadge({ status }: { status: StudyTopic["status"] }) {
  if (status === "Completed") {
    return (
      <span className="pill" style={{ backgroundColor: "var(--cat-offer-bg)", color: "var(--cat-offer)" }}>
        ✓ Nice work!
      </span>
    );
  }
  if (status === "Not Started") {
    return <span className="pill border border-border text-muted">{status}</span>;
  }
  return (
    <span className="pill" style={{ backgroundColor: "var(--cat-study-bg)", color: "var(--cat-study)" }}>
      {status}
    </span>
  );
}

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
          <StatusBadge status={topic.status} />
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
              className="flex items-center gap-1 text-xs text-accent hover:underline"
            >
              {topic.resourceName || "Resource"}
              <ExternalLink className="h-3 w-3" strokeWidth={2} />
            </a>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={() => setEditing(true)}
          aria-label="Edit topic"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <button
          onClick={onDelete}
          aria-label="Delete topic"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
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
        <h2 className="text-base font-semibold tracking-tight">Things you&rsquo;re working on</h2>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="btn-primary-sm"
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
            title="Your learning journey starts whenever you're ready 🌱"
            description="Add your first topic above — no pressure, just a starting point."
          />
        ) : (
          <div className="space-y-6">
            {grouped.map(({ category, topics }) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted">{category}</h3>
                <div className="list-soft mt-2 px-4">
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
