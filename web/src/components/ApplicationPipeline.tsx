import { ArrowRight, Award, Bookmark, ClipboardCheck, Send, UserCheck, Users } from "lucide-react";
import { PIPELINE_STATUSES } from "@/lib/trackerTypes";
import type { Application, ApplicationStatus } from "@/lib/trackerTypes";
import { statusColors, statusLabel } from "@/lib/statusDisplay";

const STAGE_ICONS: Record<ApplicationStatus, typeof Bookmark> = {
  Saved: Bookmark,
  Applied: Send,
  OA: ClipboardCheck,
  Interview: Users,
  HR: UserCheck,
  Offer: Award,
  Rejected: Bookmark,
  Withdrawn: Bookmark,
};

export default function ApplicationPipeline({
  applications,
}: {
  applications: Application[];
}) {
  const counts = PIPELINE_STATUSES.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }));
  const rejected = applications.filter((a) => a.status === "Rejected").length;
  const withdrawn = applications.filter((a) => a.status === "Withdrawn").length;

  return (
    <section>
      <h2 className="text-base font-semibold tracking-tight">Pipeline</h2>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        {counts.map((c, i) => {
          const colors = statusColors(c.status);
          const Icon = STAGE_ICONS[c.status];
          return (
            <div key={c.status} className="flex flex-1 items-center gap-2">
              <div
                className="card-soft flex-1 p-3.5 text-center"
                style={{ backgroundColor: colors.bg }}
              >
                <Icon className="mx-auto h-4 w-4" style={{ color: colors.text }} strokeWidth={2} />
                <p className="mt-1.5 text-xl font-semibold" style={{ color: colors.text }}>
                  {c.count}
                </p>
                <p className="mt-0.5 text-xs text-muted">{c.status}</p>
              </div>
              {i < counts.length - 1 && (
                <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted sm:block" strokeWidth={2} />
              )}
            </div>
          );
        })}
      </div>

      {(rejected > 0 || withdrawn > 0) && (
        <div className="mt-3 flex gap-3 text-sm">
          {rejected > 0 && (
            <span style={{ color: "var(--cat-rejected)" }}>
              {rejected} {statusLabel("Rejected").toLowerCase()}
            </span>
          )}
          {withdrawn > 0 && <span className="text-muted">{withdrawn} withdrawn</span>}
        </div>
      )}
    </section>
  );
}
