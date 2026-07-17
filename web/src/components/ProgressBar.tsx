function encouragingMessage(value: number): string {
  if (value >= 100) return "Done! You crushed this 🎉";
  if (value >= 81) return "Almost there!";
  if (value >= 61) return "You're getting there.";
  if (value >= 41) return "Look how far you've come!";
  if (value >= 21) return "You're building momentum.";
  return "Every journey starts somewhere 🌱";
}

export default function ProgressBar({
  value,
  label,
  showMessage = false,
}: {
  value: number;
  label?: string;
  /** Shows a small encouraging line under the bar — used sparingly, only
   * where a message genuinely helps (e.g. the main overview), not on every
   * tiny bar throughout the app. */
  showMessage?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full border border-border bg-surface-hover">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showMessage && (
        <p className="mt-1.5 text-xs text-muted">{encouragingMessage(clamped)}</p>
      )}
    </div>
  );
}
