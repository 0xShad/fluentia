import { termsSections, privacySections, commitments } from "@/lib/terms-data";
import { TermsContent } from "@/components/terms-content";

export const metadata = {
  title: "Terms & Conditions — Fluentia",
};

export default function DashboardTermsPage() {
  return (
    <div className="flex-1 p-6 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-2xl">
        <TermsContent
          termsSections={termsSections}
          privacySections={privacySections}
          commitments={commitments}
        />
      </div>
    </div>
  );
}
