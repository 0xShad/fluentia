"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  description: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function MetricCard({
  title,
  score,
  icon: Icon,
  description,
  trend = "neutral",
  trendValue = "0%",
}: MetricCardProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-[#00F38D]";
    if (s >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (s: number) => {
    if (s >= 80) return "bg-[#00F38D]";
    if (s >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-[#00F38D]";
    if (trend === "down") return "text-red-500";
    return "text-zinc-500";
  };

  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20 hover:border-white/20 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Icon className="w-4 h-4 text-zinc-400" />
            </div>
            <CardTitle className="text-sm font-medium text-zinc-300">{title}</CardTitle>
          </div>
          <span className={cn("text-xs font-medium", getTrendColor())}>
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trendValue}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end gap-2">
          <span className={cn("text-3xl font-bold", getScoreColor(score))}>{score}</span>
          <span className="text-sm text-zinc-500 mb-1">/ 100</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", getProgressColor(score))}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500">{description}</p>
      </CardContent>
    </Card>
  );
}
