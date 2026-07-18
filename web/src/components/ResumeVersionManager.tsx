"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { useResume, useResumeVersions } from "@/hooks/useTracker";
import type { ResumeVersion } from "@/lib/trackerTypes";
import ResumeVersionRow from "./ResumeVersionRow";

/** The version list is self-contained — it reads the active resume via
 * `useResume()` for the Master-sync and "restore" actions, and reads/writes
 * `jhp_resume_versions` via `useResumeVersions()`. It shares the latter key
 * with ResumeOptimizerSection's auto-save and stays in sync through the
 * existing localStorage pub/sub, so the two components never talk directly. */
export default function ResumeVersionManager() {
  const { resume, hydrated: resumeHydrated, setResume } = useResume();
  const {
    items,
    hydrated: versionsHydrated,
    saveMaster,
    remove,
    renameVersion,
    duplicateVersion,
    setTemplate,
  } = useResumeVersions();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Safety net: keeps the Master Resume version in sync with whatever's
  // currently uploaded in Resume Studio even if this page wasn't open when
  // the upload happened (Resume Studio itself also syncs immediately).
  useEffect(() => {
    if (!resumeHydrated || !versionsHydrated || !resume) return;
    const master = items.find((v) => v.isMaster);
    if (!master || master.content !== resume.extractedText) {
      saveMaster(resume.extractedText);
    }
  }, [resumeHydrated, versionsHydrated, resume, items, saveMaster]);

  if (!resumeHydrated || !versionsHydrated || !resume) return null;

  function handleRestore(version: ResumeVersion) {
    setResume((prev) =>
      prev ? { ...prev, extractedText: version.content, uploadedAt: new Date().toISOString() } : prev
    );
    saveMaster(version.content);
    setExpandedId(null);
  }

  const sorted = [...items].sort((a, b) => {
    if (a.isMaster) return -1;
    if (b.isMaster) return 1;
    return b.versionNumber - a.versionNumber;
  });

  return (
    <div className="card-soft p-4">
      <div className="mb-3 flex items-center gap-2">
        <History className="h-4 w-4 text-muted" strokeWidth={2} />
        <p className="text-sm font-semibold text-foreground">Resume versions</p>
      </div>

      <div className="flex flex-col gap-2">
        {sorted.map((v) => (
          <ResumeVersionRow
            key={v.id}
            version={v}
            isExpanded={expandedId === v.id}
            onToggleExpand={() => setExpandedId((prev) => (prev === v.id ? null : v.id))}
            onRename={(label) => renameVersion(v.id, label)}
            onDuplicate={() => duplicateVersion(v.id)}
            onDelete={() => remove(v.id)}
            onRestore={() => handleRestore(v)}
            onTemplateChange={(templateId) => setTemplate(v.id, templateId)}
          />
        ))}
      </div>
    </div>
  );
}
