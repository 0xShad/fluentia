"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Suggestion {
  id: string;
  type: "improvement" | "strength" | "tip";
  message: string;
  context?: string;
}

interface AISuggestionCardProps {
  suggestions: Suggestion[];
}

const iconMap = {
  improvement: AlertCircle,
  strength: CheckCircle2,
  tip: Lightbulb,
};

const colorMap = {
  improvement: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  strength: "text-[#00F38D] bg-[#00F38D]/10 border-[#00F38D]/20",
  tip: "text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20",
};

const labelMap = {
  improvement: "Improve",
  strength: "Strength",
  tip: "Tip",
};

export function AISuggestionCard({ suggestions }: AISuggestionCardProps) {
  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-[#8b5cf6]" />
          </div>
          <CardTitle className="text-lg font-semibold">AI Coaching Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion) => {
            const Icon = iconMap[suggestion.type];
            return (
              <div
                key={suggestion.id}
                className="p-4 bg-[#050505] rounded-lg border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colorMap[suggestion.type])}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={cn("text-xs", colorMap[suggestion.type])}>
                        {labelMap[suggestion.type]}
                      </Badge>
                    </div>
                    <p className="text-sm text-white leading-relaxed">{suggestion.message}</p>
                    {suggestion.context && (
                      <p className="text-xs text-zinc-500 mt-2 italic">&ldquo;{suggestion.context}&rdquo;</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
