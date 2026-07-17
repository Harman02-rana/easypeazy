import type { Resource } from "@/lib/types";

export default function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="row-hover flex items-center justify-between gap-4 border-b border-border px-4 py-4 last:border-b-0">
      <div className="min-w-0">
        <p className="font-medium text-foreground">{resource.name}</p>
        <p className="mt-0.5 text-sm text-muted">{resource.description}</p>
      </div>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-border-strong hover:bg-surface-hover"
      >
        Visit
      </a>
    </div>
  );
}
