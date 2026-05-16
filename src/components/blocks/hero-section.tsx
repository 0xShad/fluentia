"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative px-6 flex flex-col items-center text-center pb-32 overflow-hidden min-h-[90vh]">
      <DottedSurface />

      <div className="relative z-10 flex flex-col items-center w-full pt-32">
        {/* Static green glow — no JS animation */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-150 h-50 bg-primary/8 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground mb-8 border border-white/10 rounded-full px-4 py-2 bg-white/5 backdrop-blur-md"
        >
          <span className="uppercase tracking-widest font-semibold text-primary">Live Feedback</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>Real-time communication coaching.</span>
          <a href="#" className="text-white underline decoration-white/30 hover:decoration-white underline-offset-4 ml-1">Learn more...</a>
        </motion.div>

        {/* Hero Heading — no blur filter */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tight text-white leading-[1.05] mb-6 max-w-4xl mx-auto"
        >
          The Real AI Voice Coach <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-muted-foreground font-medium"
          >
            Speak with Confidence using
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="uppercase text-white"
          >
            Fluentia
          </motion.span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mb-10"
        >
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-white mb-2">Go <span className="text-primary">SOLO</span> with FLUENTIA</p>
          <p className="text-sm text-muted-foreground">The AI companion you didn&apos;t know you needed.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="flex items-center gap-4 mb-20 relative z-10"
        >
          <Button className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-12 text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,243,141,0.25)] transition-transform hover:scale-105 active:scale-95">
            Try Now <Play className="w-4 h-4 ml-2" fill="currentColor" />
          </Button>
        </motion.div>

        {/* Video Placeholder — CSS hover only, no JS scale */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="w-full max-w-250 mx-auto aspect-16/10 relative rounded-xl border border-white/10 bg-[#070707] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,243,141,0.1)] group cursor-pointer z-10"
        >
          <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-primary/5 opacity-50" />

          {/* Fake UI Header */}
          <div className="absolute top-0 w-full h-8 border-b border-white/5 flex items-center px-4 gap-2 bg-[#0a0a0a]">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>

          {/* Play Button Overlay — CSS hover only */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-300">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-primary/90 group-hover:text-black group-hover:border-primary group-hover:scale-110 transition-all duration-300">
              <Play className="w-6 h-6 ml-1" fill="currentColor" />
            </div>
          </div>

          {/* UI mockup lines */}
          <div className="absolute inset-8 top-16 border-l border-white/5 flex gap-4">
            <div className="w-64 h-full border-r border-white/5 opacity-50 rounded bg-white/2" />
            <div className="flex-1 h-full opacity-50 flex flex-col gap-4">
              <div className="w-full h-1/2 rounded bg-white/2 border border-white/5" />
              <div className="w-full h-1/2 rounded bg-white/2 border border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 p-4">
                  <div className="bg-primary/20 text-primary border border-primary/30 rounded px-2 py-1 text-[10px] font-mono uppercase">AI Ready</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Faint reflection — reduced size and opacity */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/10 blur-3xl -z-10 pointer-events-none" />
      </div>
    </section>
  );
}
