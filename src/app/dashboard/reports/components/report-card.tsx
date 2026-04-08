"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Share2, Loader2 } from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  timeframe: string;
  lastGenerated?: string;
}

interface ReportCardProps {
  template: ReportTemplate;
  onGenerate: (id: string) => void;
  onDownload: (id: string) => void;
  onShare: (id: string) => void;
  isGenerating: string | null;
}

export function ReportCard({
  template,
  onGenerate,
  onDownload,
  onShare,
  isGenerating,
}: ReportCardProps) {
  const isLoading = isGenerating === template.id;

  const IconComponent = template.icon;

  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20 hover:border-[#00F38D]/30 transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00F38D]/10 flex items-center justify-center text-[#00F38D] group-hover:bg-[#00F38D]/20 transition-colors">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{template.title}</CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                {template.timeframe} {template.lastGenerated && `• Last: ${template.lastGenerated}`}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="border-white/10 text-zinc-400 bg-transparent text-xs">
            PDF
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-400 leading-relaxed">{template.description}</p>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onGenerate(template.id)}
            disabled={isLoading}
            className="flex-1 bg-[#00F38D] text-black hover:bg-[#00F38D]/90 font-semibold text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate
              </>
            )}
          </Button>

          <Button
            onClick={() => onDownload(template.id)}
            variant="outline"
            className="border-white/10 bg-transparent hover:bg-white/5 text-white"
            size="icon"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => onShare(template.id)}
            variant="outline"
            className="border-white/10 bg-transparent hover:bg-white/5 text-white"
            size="icon"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
