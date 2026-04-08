"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function ProgressHintCard() {
  return (
    <Card className="bg-[#0A0A0A] border-white/5 text-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#00F38D]/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-[#00F38D]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Need simpler tracking?</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              If you prefer visual progress tracking over formal reports, check out the{" "}
              <a href="/dashboard" className="text-[#00F38D] hover:underline">
                Progress
              </a>{" "}
              page for charts and improvement trends. Reports are best for academic, professional, or coaching scenarios
              where formal documentation matters.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
