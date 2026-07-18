import { FileText, RefreshCw } from "lucide-react";
import { formatFileSize } from "@/lib/resumeParser";
import type { ResumeRecord } from "@/lib/trackerTypes";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ResumeFileInfoPanel({
  resume,
  onReplace,
}: {
  resume: ResumeRecord;
  onReplace: () => void;
}) {
  return (
    <div className="card-soft p-5">
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "var(--cat-study-bg)", color: "var(--cat-study)" }}
        >
          <FileText className="h-5 w-5" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{resume.fileName}</p>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-muted">{resume.fileType}</p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">File size</dt>
          <dd className="font-medium text-foreground">{formatFileSize(resume.fileSize)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Last modified</dt>
          <dd className="font-medium text-foreground">{formatDate(resume.lastModified)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Uploaded</dt>
          <dd className="font-medium text-foreground">{formatDate(new Date(resume.uploadedAt).getTime())}</dd>
        </div>
      </dl>

      <button onClick={onReplace} className="btn-secondary-sm mt-4 w-full">
        <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
        Replace resume
      </button>
    </div>
  );
}
