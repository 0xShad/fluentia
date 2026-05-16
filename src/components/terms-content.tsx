import type { TermsSection, Commitment } from "@/lib/terms-data";

interface TermsContentProps {
  termsSections: TermsSection[];
  privacySections: TermsSection[];
  commitments: Commitment[];
}

function SectionBlock({ id, title, body }: TermsSection) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="text-sm font-bold text-white mb-3">{title}</h2>
      <ul className="space-y-2.5">
        {body.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="w-1 h-1 rounded-full bg-[#00F38D]/50 mt-2 shrink-0" />
            <p className="text-sm text-white/45 leading-relaxed">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px flex-1 bg-white/8" />
      <p className="text-[11px] font-bold text-[#00F38D] uppercase tracking-widest whitespace-nowrap">{label}</p>
      <div className="h-px flex-1 bg-white/8" />
    </div>
  );
}

export function TermsContent({ termsSections, privacySections, commitments }: TermsContentProps) {
  return (
    <>
      <div className="mb-12">
        <p className="text-[11px] font-bold text-[#00F38D] uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-3xl font-extrabold text-white mb-3">Terms & Conditions</h1>
        <p className="text-sm text-white/40 leading-relaxed">
          These Terms of Service and Privacy Policy govern your use of Fluentia. By using the Service, you agree to
          everything on this page. Please read it carefully.
        </p>
        <p className="text-xs text-white/25 mt-3">Last updated: May 2026 · Effective immediately</p>
      </div>

      <div className="mb-12">
        <Divider label="Terms of Service" />
        <div className="space-y-8">
          {termsSections.map((section) => (
            <SectionBlock key={section.id} {...section} />
          ))}
        </div>
      </div>

      <div className="mb-12">
        <Divider label="Privacy Policy" />
        <div className="space-y-8">
          {privacySections.map((section) => (
            <SectionBlock key={section.id} {...section} />
          ))}
        </div>
      </div>

      <div className="pt-10 border-t border-white/8">
        <p className="text-[11px] font-bold text-[#00F38D] uppercase tracking-widest mb-2">Our Commitments</p>
        <h2 className="text-xl font-extrabold text-white mb-1">What we hold ourselves to</h2>
        <p className="text-sm text-white/35 mb-8 leading-relaxed">
          Beyond legal compliance — the standards we commit to as a product.
        </p>
        <div className="space-y-4">
          {commitments.map((c) => (
            <div key={c.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/8">
              <p className="text-sm font-semibold text-white mb-1.5">{c.title}</p>
              <p className="text-sm text-white/40 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-white/8 space-y-2">
        <p className="text-xs text-white/25 leading-relaxed">
          Questions about these Terms or your privacy?{" "}
          <a
            href="mailto:support@fluentia.app"
            className="text-white/40 hover:text-white transition-colors underline underline-offset-2"
          >
            support@fluentia.app
          </a>
        </p>
        <p className="text-xs text-white/15 leading-relaxed">
          Fluentia is an independent product. All rights reserved. These Terms do not create any employment, partnership,
          or agency relationship between you and Fluentia.
        </p>
      </div>
    </>
  );
}
