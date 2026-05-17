"use client";

import Image from "next/image";

export function ShowcaseSection() {
  return (
    <section id="how-it-works" className="py-32 relative px-6 border-t border-white/5 bg-[#050505] scroll-mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,243,141,0.05),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto flex flex-col items-center text-center relative z-10 max-w-6xl">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-4">How It Works</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Pick. Speak. Review. Improve.
        </h2>
        <p className="text-muted-foreground mb-16 max-w-2xl text-sm md:text-base">
          Choose a scenario from the library, have a voice conversation with the AI, and get a full transcript and session metrics when you&apos;re done.
        </p>

        <div className="w-full rounded-2xl border border-white/10 bg-[#070707] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)]">
          {/* Browser chrome header */}
          <div className="w-full h-8 border-b border-white/5 flex items-center px-4 gap-2 bg-[#0a0a0a] shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <Image
            src="/session-preview.jpg"
            alt="Fluentia session feedback dashboard showing transcript, performance scores and session metrics"
            width={1400}
            height={900}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
