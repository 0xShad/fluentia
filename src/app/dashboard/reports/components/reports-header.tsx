"use client";

import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export function ReportsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Reports & Exports</h2>
        <p className="text-muted-foreground text-sm max-w-xl">
          Generate professional reports, export your session data, and share progress with coaches or mentors.
        </p>
      </div>
      <Badge variant="outline" className="border-[#00F38D]/30 text-[#00F38D] bg-[#00F38D]/5 w-fit">
        <FileText className="w-3 h-3 mr-1" />
        Pro Feature
      </Badge>
    </div>
  );
}
