"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function ScenarioCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <Card
      className={`bg-[#111] border-white/10 overflow-hidden ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-20 bg-white/10 rounded-full" />
          <Skeleton className="h-5 w-16 bg-white/10 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton
          className="h-6 bg-white/10 mb-3"
          style={{ width: featured ? "70%" : "85%" }}
        />

        {/* Description */}
        <div className="space-y-2 mb-4 flex-1">
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-full bg-white/5" />
          {featured && <Skeleton className="h-4 w-3/4 bg-white/5" />}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <Skeleton className="h-4 w-24 bg-white/5" />
          <Skeleton className="h-8 w-28 bg-[#00F38D]/20 rounded-md" />
        </div>
      </div>
    </Card>
  );
}

export function PracticeSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] relative pb-20">
      <main className="flex-1 px-8 py-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <Skeleton className="h-14 w-96 bg-white/10 mb-4" />
          <Skeleton className="h-6 w-full max-w-2xl bg-white/5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-10 w-28 bg-white/10 rounded-md"
              style={{ opacity: i === 0 ? 1 : 0.5 }}
            />
          ))}
        </div>

        {/* Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Card (large) */}
          <ScenarioCardSkeleton featured />

          {/* Regular Cards */}
          {[...Array(5)].map((_, i) => (
            <ScenarioCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
