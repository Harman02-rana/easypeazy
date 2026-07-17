"use client";

import { useState } from "react";
import { APPLICATION_STATUSES, JOB_TYPES } from "@/lib/trackerTypes";
import type { Application, ApplicationJobType, ApplicationStatus } from "@/lib/trackerTypes";

export type ApplicationDraft = Omit<Application, "id" | "dateSaved">;

function toDraft(app?: Application): ApplicationDraft {
  if (app) {
    const { id: _id, dateSaved: _dateSaved, ...rest } = app;
    void _id;
    void _dateSaved;
    return rest;
  }
  return {
    company: "",
    role: "",
    jobType: "New Grad",
    location: "",
    applicationLink: "",
    dateApplied: "",
    applicationDeadline: "",
    status: "Saved",
    oaDate: "",
    oaPlatform: "",
    oaResult: "",
    interviewDate: "",
    interviewRound: "",
    interviewResult: "",
    resumeVersion: "",
    followUpDate: "",
    notes: "",
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-muted">
      {label}
      {children}
    </label>
  );
}

const inputClass =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent";

export default function ApplicationForm({
  application,
  onSave,
  onCancel,
}: {
  application?: Application;
  onSave: (draft: ApplicationDraft) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ApplicationDraft>(toDraft(application));

  function set<K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!draft.company.trim() || !draft.role.trim()) return;
        onSave(draft);
      }}
      className="space-y-4 rounded-lg border border-border bg-surface p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Company">
          <input
            value={draft.company}
            onChange={(e) => set("company", e.target.value)}
            className={inputClass}
            autoFocus
          />
        </Field>
        <Field label="Role">
          <input
            value={draft.role}
            onChange={(e) => set("role", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Job type">
          <select
            value={draft.jobType}
            onChange={(e) => set("jobType", e.target.value as ApplicationJobType)}
            className={inputClass}
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input
            value={draft.location}
            onChange={(e) => set("location", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Status">
          <select
            value={draft.status}
            onChange={(e) => set("status", e.target.value as ApplicationStatus)}
            className={inputClass}
          >
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Application link">
          <input
            value={draft.applicationLink}
            onChange={(e) => set("applicationLink", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field label="Date applied">
          <input
            type="date"
            value={draft.dateApplied}
            onChange={(e) => set("dateApplied", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Deadline">
          <input
            type="date"
            value={draft.applicationDeadline}
            onChange={(e) => set("applicationDeadline", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Follow-up date">
          <input
            type="date"
            value={draft.followUpDate}
            onChange={(e) => set("followUpDate", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Resume version">
          <input
            value={draft.resumeVersion}
            onChange={(e) => set("resumeVersion", e.target.value)}
            placeholder="Optional"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="rounded-lg border border-border p-3">
        <p className="mb-2 text-xs font-semibold text-muted">Online assessment</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="OA date">
            <input
              type="date"
              value={draft.oaDate}
              onChange={(e) => set("oaDate", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="OA platform">
            <input
              value={draft.oaPlatform}
              onChange={(e) => set("oaPlatform", e.target.value)}
              placeholder="e.g. HackerRank"
              className={inputClass}
            />
          </Field>
          <Field label="OA result">
            <input
              value={draft.oaResult}
              onChange={(e) => set("oaResult", e.target.value)}
              placeholder="e.g. Passed, Waiting"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-lg border border-border p-3">
        <p className="mb-2 text-xs font-semibold text-muted">Interview</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Field label="Interview date">
            <input
              type="date"
              value={draft.interviewDate}
              onChange={(e) => set("interviewDate", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Round">
            <input
              value={draft.interviewRound}
              onChange={(e) => set("interviewRound", e.target.value)}
              placeholder="e.g. Round 1, Technical"
              className={inputClass}
            />
          </Field>
          <Field label="Result">
            <input
              value={draft.interviewResult}
              onChange={(e) => set("interviewResult", e.target.value)}
              placeholder="e.g. Cleared, Rejected"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <Field label="Notes">
        <textarea
          value={draft.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          className={inputClass}
        />
      </Field>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer"
        >
          {application ? "Save changes" : "Add application"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
