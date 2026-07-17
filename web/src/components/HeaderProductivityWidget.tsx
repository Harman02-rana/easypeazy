import { Flame } from "lucide-react";
import DateDisplay from "./DateDisplay";
import TodayGoal from "./TodayGoal";

/**
 * Compact header widget: a small "streak" badge (Phoenix — a name only,
 * today; wiring in a real streak count/percentage later is just changing
 * this component's contents, nothing about how it's mounted in the header).
 *
 * The live clock lives separately, next to the logo on the left (see
 * Navbar.tsx) — kept out of this box so this widget stays lightweight and
 * doesn't compete with the logo/nav for width on the right side.
 *
 * Always rendered (not hidden below a breakpoint); the badge/date/goal
 * progressively appear as space opens up (sm/xl) rather than the whole
 * widget vanishing below a breakpoint.
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
      <span className="hidden xl:block">
        <span
          className="pill"
          style={{ backgroundColor: "var(--cat-interview-bg)", color: "var(--cat-interview)" }}
        >
          <Flame className="mr-1 h-3 w-3" strokeWidth={2.25} fill="var(--cat-interview)" />
          Phoenix
        </span>
      </span>

      <DateDisplay className="hidden sm:flex" />

      <TodayGoal className="hidden font-medium xl:flex" style={{ color: "var(--accent)" }} />
    </div>
  );
}
