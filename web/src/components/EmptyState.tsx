export default function EmptyState({
  title = "Nothing matches yet",
  description = "Try a different search or clear a filter.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border py-16 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </div>
  );
}
