import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { termsSections, privacySections, commitments } from "@/lib/terms-data";
import { TermsContent } from "@/components/terms-content";

export const metadata = {
  title: "Terms & Conditions — Fluentia",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <TermsContent
          termsSections={termsSections}
          privacySections={privacySections}
          commitments={commitments}
        />
      </div>
    </div>
  );
}
