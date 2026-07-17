"use client";

import { useMemo, useState } from "react";
import { useApplications } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import { APPLICATION_STATUSES, JOB_TYPES } from "@/lib/trackerTypes";
import type { Application, ApplicationStatus } from "@/lib/trackerTypes";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import ApplicationForm, { type ApplicationDraft } from "./ApplicationForm";
import EmptyState from "./EmptyState";

type SortKey = "dateApplied" | "applicationDeadline" | "dateSaved";

function statusBadgeClass(status: ApplicationStatus): string {
  if (status === "Offer") return "border-border text-foreground font-medium";
  if (status === "Rejected" || status === "Withdrawn") return "text-muted";
  return "text-foreground";
}

export default function ApplicationTable() {
  const { items, hydrated, add, update, remove } = useApplications();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dateSaved");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const locations = useMemo(
    () => Array.from(new Set(items.map((a) => a.location).filter(Boolean))).sort(),
    [items]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((a) => {
        const matchesQuery =
          !q ||
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q);
        const matchesStatus = !status || a.status === status;
        const matchesJobType = !jobType || a.jobType === jobType;
        const matchesLocation = !location || a.location === location;
        return matchesQuery && matchesStatus && matchesJobType && matchesLocation;
      })
      .sort((a, b) => (b[sortKey] || "").localeCompare(a[sortKey] || ""));
  }, [items, query, status, jobType, location, sortKey]);

  function handleSave(draft: ApplicationDraft, existing?: Application) {
    if (existing) {
      update(existing.id, draft);
      setEditingId(null);
    } else {
      add({
        id: generateId(),
        dateSaved: new Date().toISOString().slice(0, 10),
        ...draft,
      });
      setCreating(false);
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight">Applications</h2>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
          >
            Add application
          </button>
        )}
      </div>

      {creating && (
        <div className="mt-3">
          <ApplicationForm
            onSave={(draft) => handleSave(draft)}
            onCancel={() => setCreating(false)}
          />
        </div>
      )}

      {hydrated && items.length > 0 && (
        <div className="mt-4 space-y-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search by company or role..."
          />
          <div className="flex flex-wrap items-end justify-between gap-3">
            <FilterBar
              groups={[
                {
                  label: "Status",
                  value: status,
                  onChange: setStatus,
                  options: APPLICATION_STATUSES.map((s) => ({ label: s, value: s })),
                },
                {
                  label: "Job Type",
                  value: jobType,
                  onChange: setJobType,
                  options: JOB_TYPES.map((t) => ({ label: t, value: t })),
                },
                {
                  label: "Location",
                  value: location,
                  onChange: setLocation,
                  options: locations.map((l) => ({ label: l, value: l })),
                },
              ]}
            />
            <label className="flex flex-col gap-1 text-xs text-muted">
              Sort by
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              >
                <option value="dateSaved">Date saved</option>
                <option value="dateApplied">Date applied</option>
                <option value="applicationDeadline">Deadline</option>
              </select>
            </label>
          </div>
        </div>
      )}

      <div className="mt-4">
        {!hydrated ? null : items.length === 0 ? (
          <EmptyState
            title="No applications saved yet."
            description="Save a job from the Jobs page to start tracking it, or add one manually above."
          />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nothing matches" description="Try a different search or filter." />
        ) : (
          <div className="space-y-3">
            {filtered.map((app) =>
              editingId === app.id ? (
                <ApplicationForm
                  key={app.id}
                  application={app}
                  onSave={(draft) => handleSave(draft, app)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div
                  key={app.id}
                  className="rounded-lg border border-border bg-surface p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">
                          {app.company}
                        </span>
                        <span className="rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted">
                          {app.jobType}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-foreground/90">{app.role}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {app.location || "Location not specified"}
                        {app.applicationDeadline &&
                          ` · Deadline ${app.applicationDeadline}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          update(app.id, {
                            status: e.target.value as ApplicationStatus,
                          })
                        }
                        className={`rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-accent ${statusBadgeClass(app.status)}`}
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {app.applicationLink && (
                        <a
                          href={app.applicationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-surface-hover"
                        >
                          Apply ↗
                        </a>
                      )}
                      <button
                        onClick={() => setEditingId(app.id)}
                        className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-surface-hover cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(app.id)}
                        className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-hover cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
