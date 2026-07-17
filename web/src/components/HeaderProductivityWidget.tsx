import DateDisplay from "./DateDisplay";
import TodayGoal from "./TodayGoal";

/**
 * Compact header widget: date + today's goal.
 *
 * The live clock lives separately, next to the logo on the left (see
 * Navbar.tsx) — kept out of this box so this widget stays lightweight and
 * doesn't compete with the logo/nav for width on the right side.
 *
 * Always rendered (not hidden below a breakpoint); the goal progressively
 * appears as space opens up (xl) rather than the whole widget vanishing
 * below a breakpoint.
 */
export default function HeaderProductivityWidget({ className = "" }: { className?: string }) {
  return (
    <div
      className={`step-fade-in hidden items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] leading-tight text-foreground/90 backdrop-blur-sm sm:flex xl:flex-col xl:items-end xl:gap-1 ${className}`}
      style={{
        borderColor: "var(--border)",
        background:
          "linear-gradient(135deg, var(--accent-soft-bg) 0%, var(--cat-planner-bg) 100%)",
      }}
    >
      <DateDisplay className="hidden sm:flex" />

      <TodayGoal className="hidden font-medium xl:flex" style={{ color: "var(--accent)" }} />
    </div>
  );
}
