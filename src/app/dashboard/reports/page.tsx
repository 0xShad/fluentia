"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ReportsHeader } from "./components/reports-header";
import { ReportCard, type ReportTemplate } from "./components/report-card";
import { TranscriptBundleCard } from "./components/transcript-bundle-card";
import { CoachSharingCard } from "./components/coach-sharing-card";
import { RecentReportsList } from "./components/recent-reports-list";
import { ProgressHintCard } from "./components/progress-hint-card";
import { reportTemplates } from "./data/report-templates";

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      toast.success("Report Generated", {
        description: `Your ${id} report is ready for download.`,
        style: { background: "#050505", border: "1px solid rgba(0,243,141,0.2)", color: "white" },
      });
    }, 2000);
  };

  const handleDownload = (id: string) => {
    toast.info("Downloading Report", {
      description: `Your ${id} report download has started.`,
      style: { background: "#050505", border: "1px solid rgba(255,255,255,0.1)", color: "white" },
    });
  };

  const handleShare = () => {
    toast.success("Share Link Created", {
      description: "A secure link has been copied to your clipboard.",
      style: { background: "#050505", border: "1px solid rgba(0,243,141,0.2)", color: "white" },
    });
  };

  const handleBundleDownload = () => {
    toast.info("Preparing Bundle", {
      description: "Your transcript archive is being prepared. This may take a few minutes.",
      style: { background: "#050505", border: "1px solid rgba(255,255,255,0.1)", color: "white" },
    });
  };

  const handleCoachShare = () => {
    toast.success("Report Shared", {
      description: "Your coach has been notified and will receive the report shortly.",
      style: { background: "#050505", border: "1px solid rgba(139,92,246,0.3)", color: "white" },
    });
  };

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 animate-in fade-in duration-500 w-full max-w-6xl mx-auto">
      <ReportsHeader />

      <div className="grid gap-6 md:grid-cols-3">
        {reportTemplates.map((template) => (
          <ReportCard
            key={template.id}
            template={template}
            onGenerate={handleGenerate}
            onDownload={handleDownload}
            onShare={handleShare}
            isGenerating={generating}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TranscriptBundleCard onDownload={handleBundleDownload} />
        <CoachSharingCard onShare={handleCoachShare} />
        <RecentReportsList />
      </div>

      <ProgressHintCard />
    </div>
  );
}
