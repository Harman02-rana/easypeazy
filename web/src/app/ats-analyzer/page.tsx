import type { Metadata } from "next";
import { Gauge } from "lucide-react";
import TrackerHeader from "@/components/TrackerHeader";
import PageHeader from "@/components/PageHeader";
import AtsAnalyzerClient from "@/components/AtsAnalyzerClient";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `ATS Analyzer — ${SITE_NAME}`,
};

export default function AtsAnalyzerPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <TrackerHeader />

      <PageHeader
        icon={Gauge}
        eyebrow="ATS Analyzer"
        title="ATS Compatibility Analyzer"
        description="Paste a job description and see how well your uploaded resume matches it — skills, keywords, and where to improve."
        tint="var(--cat-applications)"
        tintBg="var(--cat-applications-bg)"
      />

      <div className="mt-10">
        <AtsAnalyzerClient />
      </div>
    </div>
  );
}
