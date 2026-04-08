"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2 } from "lucide-react";

interface CoachSharingCardProps {
  onShare: () => void;
}

export function CoachSharingCard({ onShare }: CoachSharingCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#8b5cf6]/10 to-transparent border-[#8b5cf6]/20 text-white shadow-xl shadow-black/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Share with Coach</CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              Send reports to your human coach
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-400 leading-relaxed">
          Instantly share your progress reports with a communication coach, mentor, or instructor.
          They&apos;ll receive a secure link to view your analytics.
        </p>

        <div className="flex items-center gap-2 p-3 bg-[#050505] rounded-lg border border-white/5">
          <div className="w-2 h-2 rounded-full bg-[#00F38D] animate-pulse" />
          <span className="text-xs text-zinc-400">
            Coach connection: <span className="text-[#00F38D]">Active</span>
          </span>
        </div>

        <Button
          onClick={onShare}
          className="w-full bg-[#8b5cf6] hover:bg-[#8b5cf6]/90 text-white font-semibold gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Latest Report
        </Button>
      </CardContent>
    </Card>
  );
}
