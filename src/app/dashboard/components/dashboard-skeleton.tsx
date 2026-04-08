"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64 bg-white/10" />
        <Skeleton className="h-4 w-96 bg-white/5" />
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-[#111] border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32 bg-white/10" />
              <Skeleton className="h-8 w-8 rounded-md bg-white/10" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 bg-white/10 mb-2" />
              <Skeleton className="h-3 w-28 bg-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Radar Chart Placeholder */}
        <Card className="bg-[#111] border-white/10 col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-40 bg-white/10 mb-2" />
            <Skeleton className="h-3 w-48 bg-white/5" />
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <Skeleton className="h-[250px] w-[250px] rounded-full bg-white/5" />
          </CardContent>
        </Card>

        {/* Bar Chart Placeholder */}
        <Card className="bg-[#111] border-white/10 col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-6 w-40 bg-white/10 mb-2" />
              <Skeleton className="h-3 w-56 bg-white/5" />
            </div>
            <Skeleton className="h-8 w-24 bg-white/10 rounded-md" />
          </CardHeader>
          <CardContent className="pb-8">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-20 bg-white/5" />
                  <Skeleton className="h-3 flex-1 bg-white/10 rounded-full" style={{ width: `${60 + Math.random() * 30}%` }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card className="bg-[#111] border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-40 bg-white/10 mb-2" />
            <Skeleton className="h-3 w-64 bg-white/5" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32 bg-white/10 rounded-md" />
            <Skeleton className="h-8 w-24 bg-white/10 rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-[200px] mt-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton
                key={i}
                className="flex-1 bg-white/10 rounded-t-md"
                style={{ height: `${30 + Math.random() * 60}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
