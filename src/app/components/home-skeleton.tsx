"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505]">
      {/* NavBar Skeleton */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded bg-[#00F38D]/20" />
            <Skeleton className="h-6 w-24 bg-white/10" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-16 bg-white/5" />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20 bg-white/10 rounded-md" />
            <Skeleton className="h-9 w-24 bg-[#00F38D]/20 rounded-md" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Skeleton className="h-16 w-full max-w-3xl mx-auto bg-white/10 mb-6" />
          <Skeleton className="h-6 w-full max-w-xl mx-auto bg-white/5 mb-4" />
          <Skeleton className="h-6 w-2/3 max-w-lg mx-auto bg-white/5 mb-10" />
          <div className="flex items-center justify-center gap-4">
            <Skeleton className="h-12 w-40 bg-[#00F38D]/20 rounded-md" />
            <Skeleton className="h-12 w-40 bg-white/10 rounded-md" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-48 bg-white/10 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 bg-white/5 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-[#111] border border-white/10 rounded-xl">
                <Skeleton className="w-12 h-12 rounded-lg bg-[#00F38D]/10 mb-4" />
                <Skeleton className="h-6 w-32 bg-white/10 mb-3" />
                <Skeleton className="h-4 w-full bg-white/5 mb-2" />
                <Skeleton className="h-4 w-3/4 bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full bg-white/10" />
              <Skeleton className="h-5 w-full bg-white/5" />
              <Skeleton className="h-5 w-5/6 bg-white/5" />
              <Skeleton className="h-5 w-4/6 bg-white/5" />
            </div>
            <Skeleton className="aspect-video bg-[#111] border border-white/10 rounded-xl" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 border-t border-white/5 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 bg-white/10 mx-auto mb-4" />
            <Skeleton className="h-5 w-96 bg-white/5 mx-auto" />
          </div>
          <div className="flex gap-6 justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-80 p-6 bg-[#111] border border-white/10 rounded-xl flex-shrink-0"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
                  <div>
                    <Skeleton className="h-4 w-24 bg-white/10 mb-1" />
                    <Skeleton className="h-3 w-16 bg-white/5" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full bg-white/5 mb-2" />
                <Skeleton className="h-4 w-full bg-white/5 mb-2" />
                <Skeleton className="h-4 w-2/3 bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-32 bg-white/10 mx-auto mb-4" />
            <Skeleton className="h-5 w-64 bg-white/5 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl border ${
                  i === 1
                    ? "bg-[#8b5cf6]/5 border-[#8b5cf6]/20"
                    : "bg-[#111] border-white/10"
                }`}
              >
                <Skeleton className="h-5 w-20 bg-white/10 mb-2" />
                <Skeleton className="h-10 w-24 bg-white/10 mb-6" />
                <div className="space-y-3 mb-6">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="w-4 h-4 rounded bg-white/10" />
                      <Skeleton className="h-4 flex-1 bg-white/5" />
                    </div>
                  ))}
                </div>
                <Skeleton
                  className={`h-10 w-full rounded-md ${
                    i === 1 ? "bg-[#8b5cf6]/20" : "bg-white/10"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 bg-white/10 mx-auto mb-4" />
            <Skeleton className="h-5 w-80 bg-white/5 mx-auto" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 bg-[#111] border border-white/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-3/4 bg-white/10" />
                  <Skeleton className="w-5 h-5 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Skeleton className="h-6 w-24 bg-white/10 mb-4" />
              <Skeleton className="h-4 w-full bg-white/5" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-5 w-20 bg-white/10 mb-4" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-24 bg-white/5" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full bg-white/5 mb-8" />
          <Skeleton className="h-4 w-48 bg-white/5 mx-auto" />
        </div>
      </footer>
    </div>
  );
}
