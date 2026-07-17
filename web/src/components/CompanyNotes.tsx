"use client";

import { useEffect, useState } from "react";
import { NotebookPen } from "lucide-react";
import { useCompanyNotes } from "@/hooks/useTracker";
import type { CompanyNote } from "@/lib/trackerTypes";

type EditableFields = Omit<CompanyNote, "companyId" | "updatedAt">;

const FIELD_LABELS: Record<keyof EditableFields, string> = {
  resumeVersion: "Resume version",
  referralStatus: "Referral status",
  interviewNotes: "Interview notes",
  oaNotes: "OA notes",
  importantDates: "Important dates",
};

export default function CompanyNotes({
  companySlug,
  companyName,
}: {
  companySlug: string;
  companyName: string;
}) {
  const { hydrated, getNote, saveNote } = useCompanyNotes();
  const [draft, setDraft] = useState<EditableFields>({
    resumeVersion: "",
    referralStatus: "",
    interviewNotes: "",
    oaNotes: "",
    importantDates: "",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!hydrated || loaded) return;
    const note = getNote(companySlug);
    setDraft({
      resumeVersion: note.resumeVersion,
      referralStatus: note.referralStatus,
      interviewNotes: note.interviewNotes,
      oaNotes: note.oaNotes,
      importantDates: note.importantDates,
    });
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, loaded]);

  if (!hydrated) return null;

  function set<K extends keyof EditableFields>(key: K, value: string) {
    const next = { ...draft, [key]: value };
    setDraft(next);
    saveNote(companySlug, { [key]: value });
  }

  return (
    <section>
      <h2 className="flex items-center gap-1.5 text-base font-semibold tracking-tight">
        <NotebookPen className="h-4 w-4 text-muted" strokeWidth={2} />
        Your notes on {companyName}
      </h2>
      <p className="mt-1 text-sm text-muted">
        Private to you, saved automatically — resume version, referral status, anything
        worth remembering next time you apply here.
      </p>

      <div className="card-soft mt-4 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs text-muted">
          {FIELD_LABELS.resumeVersion}
          <input
            value={draft.resumeVersion}
            onChange={(e) => set("resumeVersion", e.target.value)}
            placeholder="e.g. Resume_v3_backend"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          {FIELD_LABELS.referralStatus}
          <input
            value={draft.referralStatus}
            onChange={(e) => set("referralStatus", e.target.value)}
            placeholder="e.g. Asked Priya for a referral"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted sm:col-span-2">
          {FIELD_LABELS.importantDates}
          <input
            value={draft.importantDates}
            onChange={(e) => set("importantDates", e.target.value)}
            placeholder="e.g. OA window closes Aug 20"
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          {FIELD_LABELS.oaNotes}
          <textarea
            value={draft.oaNotes}
            onChange={(e) => set("oaNotes", e.target.value)}
            rows={3}
            placeholder="Platform, topics, difficulty, anything for next time..."
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          {FIELD_LABELS.interviewNotes}
          <textarea
            value={draft.interviewNotes}
            onChange={(e) => set("interviewNotes", e.target.value)}
            rows={3}
            placeholder="Rounds, questions asked, how it went..."
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>
    </section>
  );
}
