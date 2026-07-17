import DateDisplay from "./DateDisplay";

/**
 * Compact header widget: just the date.
 *
 * The live clock lives separately, next to the logo on the left (see
 * Navbar.tsx) — kept out of this box so this widget stays lightweight and
 * doesn't compete with the logo/nav for width on the right side.
 */
export default function HeaderProductivityWidget({ className = "" }: { className?: string }) {
  return (
    <div
      className={`step-fade-in hidden items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] leading-tight text-foreground/90 backdrop-blur-sm sm:flex ${className}`}
      style={{
        borderColor: "var(--border)",
        background:
          "linear-gradient(135deg, var(--accent-soft-bg) 0%, var(--cat-planner-bg) 100%)",
      }}
    >
      <DateDisplay />
    </div>
  );
}
