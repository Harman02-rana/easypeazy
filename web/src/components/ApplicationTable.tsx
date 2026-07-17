"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useApplications } from "@/hooks/useTracker";
import { generateId } from "@/lib/storage";
import { APPLICATION_STATUSES, JOB_TYPES } from "@/lib/trackerTypes";
import type { Application, ApplicationStatus } from "@/lib/trackerTypes";
import { statusColors, statusLabel } from "@/lib/statusDisplay";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import ApplicationForm, { type ApplicationDraft } from "./ApplicationForm";
import EmptyState from "./EmptyState";
import CompanyAvatar from "./CompanyAvatar";

type SortKey = "dateApplied" | "applicationDeadline" | "dateSaved";

function StatusSelect({
  app,
  onChange,
}: {
  app: Application;
  onChange: (status: ApplicationStatus) => void;
}) {
  const colors = statusColors(app.status);
  return (
    <select
      value={app.status}
      onChange={(e) => onChange(e.target.value as ApplicationStatus)}
      className="pill cursor-pointer border-0 outline-none"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {APPLICATION_STATUSES.map((s) => (
        <option key={s} value={s}>
          {statusLabel(s)}
        </option>
      ))}
    </select>
  );
}

function RowActions({
  app,
  onEdit,
  onDelete,
}: {
  app: Application;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {app.applicationLink && (
        <a
          href={app.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open application link"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
      )}
      <button
        onClick={onEdit}
        aria-label="Edit application"
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
      >
        <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      <button
        onClick={onDelete}
        aria-label="Delete application"
        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground cursor-pointer"
      >
        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
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

  const editingApp = filtered.find((a) => a.id === editingId);
  const rows = filtered.filter((a) => a.id !== editingId);

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
          <button onClick={() => setCreating(true)} className="btn-primary-sm">
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
                  options: APPLICATION_STATUSES.map((s) => ({
                    label: statusLabel(s),
                    value: s,
                  })),
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
              onClear={() => {
                setStatus("");
                setJobType("");
                setLocation("");
              }}
            />
            <label className="flex flex-col gap-1 text-xs text-muted">
              Sort by
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent-soft-bg"
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
            title="No applications here yet."
            description="Your next opportunity might be the first one. 🌱 Save a job from the Jobs page, or add one manually above."
          />
        ) : filtered.length === 0 ? (
          <EmptyState title="Nothing matches" description="Try a different search or filter." />
        ) : (
          <>
            {editingApp && (
              <div className="mb-3">
                <ApplicationForm
                  application={editingApp}
                  onSave={(draft) => handleSave(draft, editingApp)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            )}

            {/* Mobile: cards */}
            <div className="space-y-3 md:hidden">
              {rows.map((app) => (
                <div key={app.id} className="card-soft p-4">
                  <div className="flex items-start gap-3">
                    <CompanyAvatar name={app.company} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{app.company}</span>
                        <span className="badge border border-border text-muted">{app.jobType}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-foreground/90">{app.role}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {app.location || "Location not specified"}
                        {app.applicationDeadline && ` · Deadline ${app.applicationDeadline}`}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <StatusSelect app={app} onChange={(s) => update(app.id, { status: s })} />
                        <RowActions
                          app={app}
                          onEdit={() => setEditingId(app.id)}
                          onDelete={() => remove(app.id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: data table */}
            <div className="list-soft hidden overflow-x-auto md:block">
              <table className="w-full min-w-2xl border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Deadline</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((app) => (
                    <tr key={app.id} className="row-hover border-b border-border last:border-b-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <CompanyAvatar name={app.company} size="sm" />
                          <span className="font-medium text-foreground">{app.company}</span>
                        </div>
                      </td>
                      <td className="max-w-56 truncate px-4 py-3 text-foreground/90">{app.role}</td>
                      <td className="px-4 py-3 text-muted">{app.jobType}</td>
                      <td className="px-4 py-3 text-muted">{app.location || "—"}</td>
                      <td className="px-4 py-3">
                        <StatusSelect app={app} onChange={(s) => update(app.id, { status: s })} />
                      </td>
                      <td className="px-4 py-3 text-muted">{app.applicationDeadline || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <RowActions
                            app={app}
                            onEdit={() => setEditingId(app.id)}
                            onDelete={() => remove(app.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
