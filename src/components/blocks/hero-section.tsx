"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative px-6 flex flex-col items-center text-center pb-32 overflow-hidden min-h-[90vh]">
      <DottedSurface />

      <div className="relative z-10 flex flex-col items-center w-full pt-32">
        {/* Static green glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-150 h-50 bg-primary/8 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Hero Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-5xl md:text-7xl lg:text-[80px] font-bold tracking-tight text-white leading-[1.05] mb-6 max-w-4xl mx-auto"
        >
          Get Fluent. <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-muted-foreground font-medium"
          >
            Practice Your English with
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="uppercase text-white"
          >
            Fluentia
          </motion.span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mb-10"
        >
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Pick a scenario, have a real voice conversation with an AI, and review your transcript afterward. Build your communication skills one session at a time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="flex items-center gap-4 mb-20 relative z-10"
        >
          <Link href="/authentication/register">
            <Button className="rounded-sm bg-primary hover:bg-primary/90 text-black font-bold px-6 h-10 text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,141,0.2)] hover:shadow-[0_0_30px_rgba(0,243,141,0.4)] transition-all duration-200 group">
              Start Practicing <Play className="w-3.5 h-3.5 ml-2 transition-transform duration-200 group-hover:translate-x-0.5" fill="currentColor" />
            </Button>
          </Link>
        </motion.div>

        {/* Video Placeholder */}
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

          {/* Play Button Overlay */}
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
                  <div className="bg-primary/20 text-primary border border-primary/30 rounded px-2 py-1 text-[10px] font-mono uppercase">Session Ready</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Faint reflection */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/10 blur-3xl -z-10 pointer-events-none" />
      </div>
    </section>
  );
}
