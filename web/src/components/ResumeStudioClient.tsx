"use client";

import { useState } from "react";
import { useResume } from "@/hooks/useTracker";
import ResumeUpload from "./ResumeUpload";
import ResumeFileInfoPanel from "./ResumeFileInfoPanel";
import ResumePreviewPanel from "./ResumePreviewPanel";

export default function ResumeStudioClient() {
  const { resume, hydrated, setResume } = useResume();
  const [replacing, setReplacing] = useState(false);

  if (!hydrated) return null;

  if (!resume || replacing) {
    return (
      <div>
        <ResumeUpload
          compact={replacing}
          onUploaded={(record) => {
            setResume(record);
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
