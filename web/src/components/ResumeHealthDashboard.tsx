import ScoreDashboard from "./ScoreDashboard";
import { computeResumeHealth } from "@/lib/resumeHealth";

/** Job-independent quality score — computable the moment a resume exists,
 * unlike the ATS Compatibility Estimate which needs a job description to
 * compare against. Shows up on version cards even before any analysis
 * has been run. */
export default function ResumeHealthDashboard({ content, compact = false }: { content: string; compact?: boolean }) {
  const health = computeResumeHealth(content);
  return (
    <ScoreDashboard
      title="Resume Health"
      subtitle="A job-independent quality check — sections, contact info, length, and quantified impact."
      overallScore={health.score}
      categories={health.categories}
      compact={compact}
    />
  );
}
