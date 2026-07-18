import type { Metadata } from "next";
import { Mail } from "lucide-react";
import TrackerHeader from "@/components/TrackerHeader";
import PageHeader from "@/components/PageHeader";
import CoverLetterWorkspace from "@/components/CoverLetterWorkspace";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `Cover Letters — ${SITE_NAME}`,
};

export default function CoverLettersPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <TrackerHeader />

      <PageHeader
        icon={Mail}
        eyebrow="Cover Letters"
        title="Cover Letter Generator"
        description="Generate a personalized, company-specific cover letter from your resume and a job description — edit every paragraph, then export a polished PDF."
        tint="var(--cat-sister)"
        tintBg="var(--cat-sister-bg)"
      />

      <div className="mt-10">
        <CoverLetterWorkspace />
      </div>
    </div>
  );
}
