import { Flame } from "lucide-react";
import LiveClock from "./LiveClock";
import DateDisplay from "./DateDisplay";
import TodayGoal from "./TodayGoal";

/**
 * Compact header widget: a small "streak" badge (Phoenix — a name only,
 * today; wiring in a real streak count/percentage later is just changing
 * this component's contents, nothing about how it's mounted in the header).
 *
 * Deliberately built as three independent sub-components (LiveClock,
 * DateDisplay, TodayGoal) rather than one that owns all the state, so any
 * future addition (streak counter, GATE countdown, weather, a rotating
 * quote) is one more sibling here — never a rewrite of this component or
 * of how the header renders it.
 *
 * Always rendered (not hidden below a breakpoint) so the clock shows on
 * every page at every screen size; the badge/date/goal progressively
 * appear as space opens up (sm/lg) rather than the whole widget vanishing.
 */
export default function HeaderProductivityWidget({ className = "" }: { className?: string }) {
  return (
    <div
      className={`step-fade-in flex items-center gap-2 rounded-lg border px-2 py-1 text-[10px] leading-tight text-foreground/90 backdrop-blur-sm sm:px-3 sm:py-1.5 xl:flex-col xl:items-end xl:gap-1 ${className}`}
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

      <div className="flex items-center gap-2">
        <LiveClock />
        <span className="hidden text-border-strong sm:inline">·</span>
        <DateDisplay className="hidden sm:flex" />
      </div>

      <TodayGoal className="hidden font-medium xl:flex" style={{ color: "var(--accent)" }} />
    </div>
  );
}
