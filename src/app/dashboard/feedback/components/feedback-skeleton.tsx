"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedbackSkeleton() {
  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-9 w-48 bg-white/10" />
            <Skeleton className="h-6 w-24 bg-white/10 rounded-full" />
          </div>
          <Skeleton className="h-4 w-96 bg-white/5" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl bg-white/10" />
          <div>
            <Skeleton className="h-3 w-24 bg-white/5 mb-1" />
            <Skeleton className="h-8 w-16 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-[#111] border-white/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg bg-white/10" />
                  <Skeleton className="h-4 w-20 bg-white/10" />
                </div>
                <Skeleton className="h-3 w-10 bg-white/5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-end gap-2">
                <Skeleton className="h-8 w-12 bg-white/10" />
                <Skeleton className="h-4 w-10 bg-white/5 mb-1" />
              </div>
              <Skeleton className="h-2 w-full bg-white/5 rounded-full" />
              <Skeleton className="h-3 w-32 bg-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Suggestions & Transcript */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* AI Suggestions */}
        <Card className="bg-[#111] border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-lg bg-white/10" />
              <Skeleton className="h-6 w-40 bg-white/10" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 bg-[#050505] rounded-lg">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg bg-white/10 flex-shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-16 bg-white/10 rounded mb-2" />
                      <Skeleton className="h-4 w-full bg-white/5 mb-1" />
                      <Skeleton className="h-4 w-3/4 bg-white/5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transcript */}
        <Card className="bg-[#111] border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-lg bg-white/10" />
                <Skeleton className="h-6 w-40 bg-white/10" />
              </div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-16 bg-white/10 rounded-full" />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 p-3 bg-[#050505] rounded-lg">
                  <Skeleton className="h-4 w-12 bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full bg-white/5" />
                    <Skeleton className="h-4 w-3/4 bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
