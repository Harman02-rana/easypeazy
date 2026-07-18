"use client";

import { useEffect, useMemo, useState } from "react";
import { History, Search } from "lucide-react";
import { useAtsAnalyses, useResume, useResumeVersions } from "@/hooks/useTracker";
import type { ResumeVersion } from "@/lib/trackerTypes";
import { RESUME_TEMPLATES } from "@/lib/resumeTemplates";
import ResumeVersionCard from "./ResumeVersionCard";
import ResumeTimeline from "./ResumeTimeline";

type SortOrder = "recent" | "health" | "name";

/** Self-contained — reads the active resume via `useResume()` for the
 * Master-sync and "restore"/"edit master" actions, and reads/writes
 * `jhp_resume_versions` via `useResumeVersions()`. Shares that key with
 * ResumeOptimizerSection's auto-save and stays in sync through the
 * existing localStorage pub/sub, so the two components never talk
 * directly. Also reads `useAtsAnalyses()` read-only, just to show each
 * version's linked ATS score when it has one. */
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
    update,
  } = useResumeVersions();
  const { items: analyses } = useAtsAnalyses();

  const [search, setSearch] = useState("");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");

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

  const companies = useMemo(
    () => [...new Set(items.filter((v) => v.companyName).map((v) => v.companyName))].sort(),
    [items]
  );

  const atsScoreByVersion = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of items) {
      if (v.sourceAnalysisId) {
        const analysis = analyses.find((a) => a.id === v.sourceAnalysisId);
        if (analysis) map.set(v.id, analysis.overallScore);
      }
    }
    return map;
  }, [items, analyses]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let filtered = items.filter((v) => {
      if (q && !`${v.label} ${v.companyName} ${v.jobRole}`.toLowerCase().includes(q)) return false;
      if (templateFilter !== "all" && v.templateId !== templateFilter) return false;
      if (companyFilter !== "all" && v.companyName !== companyFilter) return false;
      return true;
    });

    filtered = [...filtered].sort((a, b) => {
      if (a.isMaster) return -1;
      if (b.isMaster) return 1;
      if (sortOrder === "name") return a.label.localeCompare(b.label);
      if (sortOrder === "recent") return new Date(b.lastModifiedAt).getTime() - new Date(a.lastModifiedAt).getTime();
      return b.versionNumber - a.versionNumber;
    });
    return filtered;
  }, [items, search, templateFilter, companyFilter, sortOrder]);

  if (!resumeHydrated || !versionsHydrated || !resume) return null;

  function handleRestore(version: ResumeVersion) {
    setResume((prev) =>
      prev ? { ...prev, extractedText: version.content, uploadedAt: new Date().toISOString() } : prev
    );
    saveMaster(version.content);
  }

  function handleSaveEditedContent(version: ResumeVersion, newContent: string) {
    if (version.isMaster) {
      setResume((prev) => (prev ? { ...prev, extractedText: newContent, uploadedAt: new Date().toISOString() } : prev));
      saveMaster(newContent);
    } else {
      update(version.id, { content: newContent, lastModifiedAt: new Date().toISOString() });
    }
  }

  return (
    <div className="space-y-4">
      <div className="card-soft p-4">
        <div className="mb-3 flex items-center gap-2">
          <History className="h-4 w-4 text-muted" strokeWidth={2} />
          <p className="text-sm font-semibold text-foreground">Resume versions</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-40 flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" strokeWidth={2} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, or role..."
              className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs text-foreground outline-none focus:border-accent"
            />
          </div>
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-accent"
          >
            <option value="all">All templates</option>
            {RESUME_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {companies.length > 0 && (
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-accent"
            >
              <option value="all">All companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-accent"
          >
            <option value="recent">Recently updated</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {visible.length === 0 ? (
          <p className="mt-4 text-xs text-muted">No versions match this search/filter.</p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((v) => (
              <ResumeVersionCard
                key={v.id}
                version={v}
                atsScore={atsScoreByVersion.get(v.id) ?? null}
                onRename={(label) => renameVersion(v.id, label)}
                onDuplicate={() => duplicateVersion(v.id)}
                onDelete={() => remove(v.id)}
                onRestore={() => handleRestore(v)}
                onTemplateChange={(templateId) => setTemplate(v.id, templateId)}
                onSaveEditedContent={(content) => handleSaveEditedContent(v, content)}
              />
            ))}
          </div>
        )}
      </div>

      <ResumeTimeline versions={items} />
    </div>
  );
}
