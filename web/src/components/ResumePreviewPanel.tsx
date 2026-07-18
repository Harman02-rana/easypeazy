import { ScrollText } from "lucide-react";

export default function ResumePreviewPanel({ text }: { text: string }) {
  return (
    <div className="card-soft flex h-full flex-col p-5">
      <div className="flex items-center gap-2">
        <ScrollText className="h-4 w-4" style={{ color: "var(--cat-study)" }} strokeWidth={2} />
        <p className="text-sm font-semibold text-foreground">Extracted text</p>
      </div>
      <div
        className="mt-3 max-h-[28rem] flex-1 overflow-y-auto rounded-xl border border-border p-4"
        style={{ backgroundColor: "var(--background)" }}
      >
        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground/90">
          {text}
        </pre>
      </div>
    </div>
  );
}
