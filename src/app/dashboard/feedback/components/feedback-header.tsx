"use client";

import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles } from "lucide-react";

interface FeedbackHeaderProps {
  sessionTitle?: string;
  sessionDate?: string;
}

export function FeedbackHeader({ sessionTitle, sessionDate }: FeedbackHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">Detailed Feedback</h2>
          <Badge className="bg-[#8b5cf6]/20 text-[#8b5cf6] border-[#8b5cf6]/30">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm max-w-xl">
          Your personal communication coach. Review metrics, insights, and specific areas for improvement from your practice sessions.
        </p>
        {sessionTitle && (
          <p className="text-xs text-zinc-500 mt-2">
            Analyzing: <span className="text-zinc-300">{sessionTitle}</span>
            {sessionDate && <span className="text-zinc-500"> • {sessionDate}</span>}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center">
          <Brain className="w-6 h-6 text-[#8b5cf6]" />
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Overall Score</p>
          <p className="text-2xl font-bold text-white">78<span className="text-sm text-zinc-500">/100</span></p>
        </div>
      </div>
    </div>
  );
}
