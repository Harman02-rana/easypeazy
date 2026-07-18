"use client";

import { useState } from "react";
import { useResume, useResumeVersions } from "@/hooks/useTracker";
import ResumeUpload from "./ResumeUpload";
import ResumeFileInfoPanel from "./ResumeFileInfoPanel";
import ResumePreviewPanel from "./ResumePreviewPanel";

export default function ResumeStudioClient() {
  const { resume, hydrated, setResume } = useResume();
  const { saveMaster } = useResumeVersions();
  const [replacing, setReplacing] = useState(false);

  if (!hydrated) {
    return (
      <div className="grid animate-pulse gap-5 md:grid-cols-[18rem_1fr]">
        <div className="card-soft h-64 p-4">
          <div className="h-4 w-2/3 rounded bg-surface-hover" />
          <div className="mt-4 h-40 rounded bg-surface-hover" />
        </div>
        <div className="card-soft h-64 p-4">
          <div className="h-full rounded bg-surface-hover" />
        </div>
      </div>
    );
  }

  if (!resume || replacing) {
    return (
      <div>
        <ResumeUpload
          compact={replacing}
          onUploaded={(record) => {
            setResume(record);
            // The uploaded resume IS the Master Resume — keep the version
            // manager's copy in sync the instant it changes, not just the
            // next time that page happens to mount.
            saveMaster(record.extractedText);
            setReplacing(false);
          }}
        />
        {replacing && (
          <button onClick={() => setReplacing(false)} className="btn-secondary-sm mt-3">
            Cancel
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-[18rem_1fr]">
      <ResumeFileInfoPanel resume={resume} onReplace={() => setReplacing(true)} />
      <ResumePreviewPanel text={resume.extractedText} />
    </div>
  );
}
