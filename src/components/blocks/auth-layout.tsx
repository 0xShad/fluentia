"use client";

import { testimonials } from "@/data/testimonials";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Rotating testimonial panel — cycles through testimonials every 6s
function TestimonialPanel() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % testimonials.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const current = testimonials[index];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8 p-8">

      {/* Animated testimonial card */}
      <div
        className={cn(
          "transition-all duration-400",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        <TestimonialCard
          author={current.author}
          text={current.text}
          href={current.href}
          className="bg-white/[0.04] border-white/10 backdrop-blur-md max-w-sm"
        />
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2 mt-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setVisible(false);
              setTimeout(() => {
                setIndex(i);
                setVisible(true);
              }, 300);
            }}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === index
                ? "w-6 bg-[#00F38D]"
                : "w-1.5 bg-white/20 hover:bg-white/40"
            )}
            aria-label={`Show testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex font-sans relative overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#00F38D]/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#00F38D]/3 blur-3xl" />
      </div>

      {/* LEFT — form panel */}
      <div className="relative z-10 flex flex-col w-full lg:w-1/2 min-h-screen px-8 sm:px-12 py-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 mb-auto"
        >
          <span className="text-xl font-bold tracking-tight text-white uppercase">fluentia</span>
        </Link>

        {/* Form slot */}
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Footer */}
        <p className="text-xs text-white/25 text-center mt-auto">
          By continuing you agree to our{" "}
          <Link href="/terms" className="underline hover:text-white/50 transition-colors">
            Terms
          </Link>{" "}
          &amp;{" "}
          <Link href="/privacy" className="underline hover:text-white/50 transition-colors">
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {/* RIGHT — testimonial panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 border-l border-white/[0.06] bg-[#020202]">
        {/* Faint dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#00f38d18_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        <TestimonialPanel />
      </div>
    </div>
  );
}
