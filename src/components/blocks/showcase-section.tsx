"use client";

import { BarChart } from "lucide-react";

export function ShowcaseSection() {
  return (
    <section id="how-it-works" className="py-32 relative px-6 border-t border-white/5 bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,243,141,0.05),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto flex flex-col items-center text-center relative z-10 max-w-6xl">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-4">How It Works</p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Pick. Speak. Review. Improve.
        </h2>
        <p className="text-muted-foreground mb-16 max-w-2xl text-sm md:text-base">
          Choose a scenario from the library, have a voice conversation with the AI, and get a full transcript and session metrics when you&apos;re done. No fluff — just practice and review.
        </p>

        <div className="w-full aspect-video md:aspect-21/9 bg-[#080808] border border-white/10 rounded-2xl flex items-center justify-center relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group">
          {/* Fake UI mockup header */}
          <div className="absolute top-0 w-full h-10 border-b border-white/5 flex items-center px-4 bg-[#0a0a0a]">
            <p className="text-xs text-muted-foreground mx-auto flex items-center gap-2">
              <BarChart className="w-3 h-3" /> fluentia — session dashboard
            </p>
          </div>

          {/* Content */}
          <div className="text-center relative z-10 flex flex-col items-center mt-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 hover:scale-110 transition-transform duration-300">
              <span className="font-bold text-primary text-2xl uppercase tracking-tighter">Fl</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
              <p className="text-xs text-white">Session Transcript Dashboard</p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 p-8 flex gap-4">
            <div className="w-48 h-32 rounded-lg bg-white/5 border border-white/10 transform translate-y-8 translate-x-8 -rotate-6 hidden md:block backdrop-blur-sm" />
            <div className="w-64 h-48 rounded-lg bg-zinc-900 border border-white/10 transform translate-y-12 translate-x-12 hidden md:block shadow-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
