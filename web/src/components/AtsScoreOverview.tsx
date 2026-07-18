import ScoreDashboard from "./ScoreDashboard";
import type { AtsAnalysisResult } from "@/lib/trackerTypes";

export default function AtsScoreOverview({ result }: { result: AtsAnalysisResult }) {
  return (
    <ScoreDashboard
      title="ATS Compatibility Estimate"
      subtitle={`${result.companyName ? `${result.companyName} · ` : ""}${result.jobRole || "Role not specified"} — based on ${result.resumeFileName}`}
      overallScore={result.overallScore}
      categories={result.categoryScores}
    />
  );
}
