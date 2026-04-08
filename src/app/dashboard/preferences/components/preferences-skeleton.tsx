"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function PreferenceCardSkeleton() {
  return (
    <Card className="bg-[#111] border-white/10 shadow-xl shadow-black/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg bg-white/10" />
          <div>
            <Skeleton className="h-5 w-32 bg-white/10 mb-1" />
            <Skeleton className="h-3 w-48 bg-white/5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Setting Row 1 */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 bg-white/5" />
          <Skeleton className="h-10 w-full bg-white/10 rounded-md" />
        </div>
        {/* Setting Row 2 */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-28 bg-white/5" />
          <Skeleton className="h-10 w-full bg-white/10 rounded-md" />
        </div>
        {/* Toggle Row */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32 bg-white/10" />
            <Skeleton className="h-3 w-48 bg-white/5" />
          </div>
          <Skeleton className="h-6 w-11 bg-white/10 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PreferencesSkeleton() {
  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 w-full max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64 bg-white/10" />
        <Skeleton className="h-4 w-96 bg-white/5" />
      </div>

      {/* Two Column Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Column 1 */}
        <div className="space-y-8">
          <PreferenceCardSkeleton />
          <PreferenceCardSkeleton />
          <PreferenceCardSkeleton />
        </div>
        {/* Column 2 */}
        <div className="space-y-8">
          <PreferenceCardSkeleton />
          <PreferenceCardSkeleton />
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 right-0 left-0 md:left-[var(--sidebar-width)] p-4 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-end gap-4 z-50">
        <Skeleton className="h-10 w-36 bg-white/10 rounded-md" />
        <Skeleton className="h-10 w-40 bg-[#00F38D]/20 rounded-md" />
      </div>
    </div>
  );
}
