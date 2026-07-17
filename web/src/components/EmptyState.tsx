export default function EmptyState({
  title = "Nothing here yet",
  description = "Try a different search or clear a filter.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface/60 py-16 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  );
}
