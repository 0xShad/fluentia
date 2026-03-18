"use client";

import { AnimatedSection, AnimatedHeading } from "@/components/ui/animated-section";
import { motion } from "framer-motion";
import { BarChart } from "lucide-react";

export function ShowcaseSection() {
  return (
    <section className="py-32 relative px-6 border-t border-white/5 bg-[#050505]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,243,141,0.05),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto flex flex-col items-center text-center relative z-10 max-w-6xl">
        <AnimatedSection variant="fadeUp" delay={0}>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-4">See it in Action</p>
        </AnimatedSection>
        <AnimatedHeading as="h2" delay={0.1} className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Speak Better with FLUENTIA
        </AnimatedHeading>
        <AnimatedSection variant="fadeUp" delay={0.2}>
          <p className="text-muted-foreground mb-16 max-w-2xl text-sm md:text-base">
            Whether you&apos;re preparing for a critical job interview or leading a team meeting, Fluentia gives you the real-time feedback and structured practice to communicate flawlessly.
          </p>
        </AnimatedSection>

        <AnimatedSection variant="scaleUp" delay={0.3} className="w-full">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="w-full aspect-[16/9] md:aspect-[21/9] bg-[#080808] border border-white/10 rounded-2xl flex items-center justify-center relative shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group"
          >
            {/* Fake UI mockup header */}
            <div className="absolute top-0 w-full h-10 border-b border-white/5 flex items-center px-4 bg-[#0a0a0a]">
              <p className="text-xs text-muted-foreground mx-auto flex items-center gap-2">
                <BarChart className="w-3 h-3" /> fluentia-dashboard-preview
              </p>
            </div>

            {/* Content */}
            <div className="text-center relative z-10 flex flex-col items-center mt-10">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <span className="font-bold text-primary text-2xl uppercase tracking-tighter">Fl</span>
              </motion.div>
              <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md">
                <p className="text-xs text-white">Live Audio Analysis Dashboard</p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 right-0 p-8 flex gap-4">
              <div className="w-48 h-32 rounded-lg bg-white/5 border border-white/10 transform translate-y-8 translate-x-8 -rotate-6 hidden md:block backdrop-blur-sm" />
              <div className="w-64 h-48 rounded-lg bg-zinc-900 border border-white/10 transform translate-y-12 translate-x-12 hidden md:block shadow-xl" />
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}
