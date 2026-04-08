"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

interface Report {
  name: string;
  date: string;
  size: string;
}

const recentReports: Report[] = [
  { name: "Weekly Summary - Apr Week 1", date: "Apr 7, 2026", size: "1.2 MB" },
  { name: "Monthly Report - March 2026", date: "Apr 1, 2026", size: "3.8 MB" },
  { name: "Session Analytics Q1 2026", date: "Mar 31, 2026", size: "5.1 MB" },
];

export function RecentReportsList() {
  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recently Generated</CardTitle>
        <CardDescription className="text-zinc-400 text-xs">
          Your last 10 reports are saved for 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#050505] rounded-lg border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#00F38D]/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#00F38D]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{report.name}</p>
                  <p className="text-xs text-zinc-500">
                    {report.date} • {report.size}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
