import type { Metadata } from "next";
import { FileText } from "lucide-react";
import TrackerHeader from "@/components/TrackerHeader";
import PageHeader from "@/components/PageHeader";
import ResumeStudioClient from "@/components/ResumeStudioClient";
import { SITE_NAME } from "@/lib/personalConfig";

export const metadata: Metadata = {
  title: `Resume Studio — ${SITE_NAME}`,
};

export default function ResumeStudioPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <TrackerHeader />

      <PageHeader
        icon={FileText}
        eyebrow="Resume Studio"
        title="Resume Studio"
        description="Upload your resume once — read it back here anytime, no re-uploading needed."
        tint="var(--cat-study)"
        tintBg="var(--cat-study-bg)"
      />

      <div className="mt-10">
        <ResumeStudioClient />
      </div>
    </div>
  );
}
