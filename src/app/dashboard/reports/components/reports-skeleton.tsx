"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ReportCardSkeleton() {
  return (
    <Card className="bg-[#111] border-white/10 shadow-xl shadow-black/20">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg bg-white/10" />
            <div>
              <Skeleton className="h-5 w-32 bg-white/10 mb-1" />
              <Skeleton className="h-3 w-24 bg-white/5" />
            </div>
          </div>
          <Skeleton className="h-5 w-10 bg-white/10 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full bg-white/5" />
        <Skeleton className="h-4 w-3/4 bg-white/5" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1 bg-white/10 rounded-md" />
          <Skeleton className="h-9 w-9 bg-white/10 rounded-md" />
          <Skeleton className="h-9 w-9 bg-white/10 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportsSkeleton() {
  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-48 bg-white/10 mb-2" />
          <Skeleton className="h-4 w-96 bg-white/5" />
        </div>
        <Skeleton className="h-6 w-24 bg-white/10 rounded-full" />
      </div>

      {/* Report Templates Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <ReportCardSkeleton key={i} />
        ))}
      </div>

      {/* Additional Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Transcript Bundle */}
        <Card className="bg-[#111] border-white/10 shadow-xl shadow-black/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg bg-white/10" />
              <div>
                <Skeleton className="h-5 w-36 bg-white/10 mb-1" />
                <Skeleton className="h-3 w-32 bg-white/5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full bg-white/5" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-40 bg-white/5" />
              ))}
            </div>
            <Skeleton className="h-10 w-full bg-white/10 rounded-md" />
          </CardContent>
        </Card>

        {/* Coach Sharing */}
        <Card className="bg-[#111] border-white/10 shadow-xl shadow-black/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg bg-white/10" />
              <div>
                <Skeleton className="h-5 w-32 bg-white/10 mb-1" />
                <Skeleton className="h-3 w-36 bg-white/5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-12 w-full bg-white/5 rounded-lg" />
            <Skeleton className="h-10 w-full bg-white/10 rounded-md" />
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="bg-[#111] border-white/10 shadow-xl shadow-black/20">
          <CardHeader>
            <Skeleton className="h-6 w-36 bg-white/10 mb-1" />
            <Skeleton className="h-3 w-48 bg-white/5" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#050505] rounded-lg">
                  <Skeleton className="w-8 h-8 rounded bg-white/10" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-48 bg-white/10 mb-1" />
                    <Skeleton className="h-3 w-24 bg-white/5" />
                  </div>
                  <Skeleton className="h-8 w-8 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-[#0A0A0A] border-white/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-6 w-48 bg-white/10 mb-2" />
              <Skeleton className="h-4 w-full bg-white/5 mb-1" />
              <Skeleton className="h-4 w-3/4 bg-white/5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
