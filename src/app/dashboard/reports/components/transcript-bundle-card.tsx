"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileArchive, Download, CheckCircle2 } from "lucide-react";

interface TranscriptBundleCardProps {
  onDownload: () => void;
}

export function TranscriptBundleCard({ onDownload }: TranscriptBundleCardProps) {
  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#6366f1]/10 flex items-center justify-center text-[#6366f1]">
            <FileArchive className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Transcript Bundle</CardTitle>
            <CardDescription className="text-zinc-400 text-xs">
              All session transcripts & audio
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-400 leading-relaxed">
          Download a complete archive of all your practice session transcripts and recordings.
          Perfect for offline review or sharing with a human coach.
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle2 className="w-3 h-3 text-[#00F38D]" />
            <span>147 transcripts included</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle2 className="w-3 h-3 text-[#00F38D]" />
            <span>Audio files (MP3 format)</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle2 className="w-3 h-3 text-[#00F38D]" />
            <span>Estimated size: 234 MB</span>
          </div>
        </div>

        <Button
          onClick={onDownload}
          variant="outline"
          className="w-full border-white/10 bg-transparent hover:bg-white/5 text-white gap-2"
        >
          <Download className="w-4 h-4" />
          Download Bundle (.zip)
        </Button>
      </CardContent>
    </Card>
  );
}
