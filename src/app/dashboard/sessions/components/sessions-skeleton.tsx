"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SessionsSkeleton() {
  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-9 w-48 bg-white/10 mb-2" />
          <Skeleton className="h-4 w-72 bg-white/5" />
        </div>
        <Skeleton className="h-10 w-36 bg-[#00F38D]/20 rounded-md" />
      </div>

      {/* Table Container */}
      <Card className="bg-[#111] border-white/10 rounded-xl shadow-2xl">
        {/* Table Header / Search */}
        <div className="p-4 border-b border-white/10 bg-[#0A0A0A] rounded-t-xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <Skeleton className="h-10 w-full sm:max-w-sm bg-white/10 rounded-md" />
            <Skeleton className="h-10 w-24 bg-white/10 rounded-md" />
          </div>
        </div>

        {/* Table */}
        <div className="p-4">
          {/* Table Header Row */}
          <div className="flex gap-4 pb-4 border-b border-white/10">
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-4 bg-white/5"
                style={{ width: i === 1 ? "300px" : i === 7 ? "40px" : `${12 + Math.random() * 8}%` }}
              />
            ))}
          </div>

          {/* Table Body Rows */}
          <div className="space-y-2 pt-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <Skeleton className="h-4 w-16 bg-white/5" />
                <Skeleton className="h-4 flex-1 bg-white/10" style={{ maxWidth: 300 }} />
                <Skeleton className="h-5 w-20 bg-white/10 rounded-md" />
                <Skeleton className="h-4 w-32 bg-white/5" />
                <Skeleton className="h-4 w-16 bg-white/5" />
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-5 w-24 bg-white/10 rounded-full" />
                <Skeleton className="h-8 w-8 bg-white/10 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
