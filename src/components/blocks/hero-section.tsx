"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";

const DEMO_VIDEO_URL =
  "https://sltsyadsiuwfbtcgtczz.supabase.co/storage/v1/object/sign/public-assets/demo.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85ZjkwODYwMy0zNzJlLTQyNTUtOWM3Ni1mNDg1ZGRmYjI5NTYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwdWJsaWMtYXNzZXRzL2RlbW8ubXA0IiwiaWF0IjoxNzc5MjAwMzc5LCJleHAiOjE4MTA3MzYzNzl9.IK-6w_jrazhpU5a4990I_WMl7rzADrLFoRuzGCSqGQ8";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const shouldReduce = useReducedMotion();

  const shouldLoadInView = useInView(containerRef, { once: true, margin: "400px 0px" });
  const isInView = useInView(containerRef, { once: false, margin: "-80px 0px" });

  useEffect(() => {
    if (shouldLoadInView) setShouldLoad(true);
  }, [shouldLoadInView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView && !shouldReduce) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView, shouldLoad, shouldReduce]); // shouldLoad re-triggers when the video element mounts

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
            <Button className="rounded-sm bg-primary hover:bg-primary/90 text-black font-bold px-6 h-10 text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,141,0.2)] hover:shadow-[0_0_30px_rgba(0,243,141,0.4)] transition-[colors,shadow,transform] duration-150 group">
              Start Practicing <Play className="w-3.5 h-3.5 ml-2 transition-transform duration-200 group-hover:translate-x-0.5" fill="currentColor" />
            </Button>
          </Link>
        </motion.div>

        {/* Video Container */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="w-full max-w-250 mx-auto aspect-16/10 relative rounded-xl border border-white/10 bg-[#070707] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,243,141,0.1)] z-10"
        >
          {/* Top gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-primary/5 opacity-50 pointer-events-none z-10" />

          {/* Browser chrome header */}
          <div className="absolute top-0 w-full h-8 border-b border-white/5 flex items-center px-4 gap-2 bg-[#0a0a0a] z-20">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>

          {/* Skeleton — visible until onCanPlay fires */}
          {!isReady && (
            <div className="absolute inset-0 top-8 bg-[#070707] z-10">
              <div className="absolute inset-0 bg-linear-to-br from-white/3 via-transparent to-white/3 animate-pulse" />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#0A0A0A]/60" />
            </div>
          )}

          {/* Video — not mounted until shouldLoad is true */}
          {shouldLoad && (
            <video
              ref={videoRef}
              src={DEMO_VIDEO_URL}
              muted
              loop
              playsInline
              preload="none"
              onCanPlay={() => setIsReady(true)}
              className="absolute inset-0 w-full h-full object-cover top-8"
              aria-hidden="true"
            />
          )}

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#0A0A0A] to-transparent pointer-events-none z-10" />

          {/* Side vignette */}
          <div className="absolute inset-0 bg-linear-to-r from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/40 pointer-events-none z-10" />

          {/* DEMO badge */}
          <div className="absolute bottom-3 right-3 z-20 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            demo
          </div>
        </motion.div>

        {/* Faint reflection */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/10 blur-3xl -z-10 pointer-events-none" />
      </div>
    </section>
  );
}
