"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 w-full max-w-5xl mx-auto">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-64 bg-white/10" />
        <Skeleton className="h-4 w-96 bg-white/5" />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column - Account & AI Coaching Cards */}
        <div className="md:col-span-2 space-y-8">
          {/* Account Info Card Skeleton */}
          <Card className="bg-[#111] border-white/10 shadow-xl shadow-black/20">
            <CardHeader className="pb-6">
              <Skeleton className="h-6 w-48 bg-white/10 mb-2" />
              <Skeleton className="h-3 w-64 bg-white/5" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar & Name Row */}
              <div className="flex items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-white/10" />
                  <Skeleton className="h-3 w-48 bg-white/5" />
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 bg-white/5" />
                  <Skeleton className="h-10 w-full bg-white/10 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24 bg-white/5" />
                  <Skeleton className="h-10 w-full bg-white/5 rounded-md" />
                </div>
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 bg-white/5" />
                <Skeleton className="h-24 w-full bg-white/10 rounded-md" />
              </div>
            </CardContent>
            {/* Footer */}
            <div className="border-t border-white/5 bg-[#0A0A0A] p-4 flex justify-end">
              <Skeleton className="h-9 w-32 bg-white/10 rounded-md" />
            </div>
          </Card>

          {/* AI Coaching Card Skeleton */}
          <Card className="bg-[#111] border-white/10 shadow-xl shadow-black/20">
            <CardHeader className="pb-6">
              <Skeleton className="h-6 w-48 bg-white/10 mb-2" />
              <Skeleton className="h-3 w-72 bg-white/5" />
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Speaking Goals */}
              <div className="space-y-3">
                <Skeleton className="h-3 w-28 bg-white/5" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-9 w-28 bg-white/10 rounded-md" />
                  <Skeleton className="h-9 w-32 bg-white/10 rounded-md" />
                  <Skeleton className="h-9 w-24 bg-white/10 rounded-md" />
                  <Skeleton className="h-9 w-36 bg-white/10 rounded-md" />
                </div>
              </div>

              {/* Skill Level & Coaching Style */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24 bg-white/5" />
                  <Skeleton className="h-10 w-full bg-white/10 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-28 bg-white/5" />
                  <Skeleton className="h-10 w-full bg-white/10 rounded-md" />
                </div>
              </div>
            </CardContent>
            {/* Footer */}
            <div className="border-t border-white/5 bg-[#0A0A0A] p-4 flex justify-end">
              <Skeleton className="h-9 w-36 bg-white/10 rounded-md" />
            </div>
          </Card>
        </div>

        {/* Right Column - Subscription & Security */}
        <div className="space-y-6">
          {/* Subscription Card Skeleton */}
          <Card className="bg-[#111] border-white/10 shadow-xl shadow-black/20">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-36 bg-white/10" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-24 w-full bg-[#8b5cf6]/5 rounded-lg border border-[#8b5cf6]/20" />
              <Skeleton className="h-10 w-full bg-white/10 rounded-md" />
            </CardContent>
          </Card>

          {/* Security Card Skeleton */}
          <Card className="bg-[#111] border-white/10 shadow-xl shadow-black/20">
            <CardHeader className="pb-4">
              <Skeleton className="h-5 w-32 bg-white/10 mb-2" />
              <Skeleton className="h-3 w-48 bg-white/5" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full bg-white/10 rounded-md" />
              <div className="pt-4 mt-4 border-t border-white/5">
                <Skeleton className="h-10 w-full bg-red-500/5 rounded-md border border-red-500/20" />
                <Skeleton className="h-8 w-full bg-white/5 mt-2 rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
