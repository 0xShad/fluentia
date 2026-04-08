"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, AlertTriangle, Clock } from "lucide-react";

export interface TranscriptSegment {
  id: string;
  timestamp: string;
  text: string;
  highlights: {
    type: "filler" | "pause" | "fast" | "good";
    start: number;
    end: number;
  }[];
}

interface TranscriptHighlightsProps {
  segments: TranscriptSegment[];
}

const highlightStyles = {
  filler: "bg-yellow-500/20 text-yellow-500 border-b border-yellow-500/50",
  pause: "bg-blue-500/20 text-blue-500 border-b border-blue-500/50",
  fast: "bg-red-500/20 text-red-500 border-b border-red-500/50",
  good: "bg-[#00F38D]/20 text-[#00F38D] border-b border-[#00F38D]/50",
};

const highlightLabels = {
  filler: "Filler word",
  pause: "Long pause",
  fast: "Too fast",
  good: "Good pace",
};

const highlightIcons = {
  filler: AlertTriangle,
  pause: Clock,
  fast: AlertTriangle,
  good: MessageSquare,
};

function HighlightedText({ text, highlights }: { text: string; highlights: TranscriptSegment["highlights"] }) {
  if (highlights.length === 0) return <span>{text}</span>;

  const parts: React.ReactElement[] = [];
  let lastIndex = 0;

  // Sort highlights by start position
  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

  sortedHighlights.forEach((highlight, i) => {
    // Add text before highlight
    if (highlight.start > lastIndex) {
      parts.push(
        <span key={`text-${i}`}>{text.slice(lastIndex, highlight.start)}</span>
      );
    }

    // Add highlighted text
    const highlightedText = text.slice(highlight.start, highlight.end);
    parts.push(
      <mark
        key={`highlight-${i}`}
        className={`${highlightStyles[highlight.type]} rounded px-1 py-0.5`}
        title={highlightLabels[highlight.type]}
      >
        {highlightedText}
      </mark>
    );

    lastIndex = highlight.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
}

export function TranscriptHighlights({ segments }: TranscriptHighlightsProps) {
  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00F38D]/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#00F38D]" />
            </div>
            <CardTitle className="text-lg font-semibold">Transcript Analysis</CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/10 text-xs">
              Filler words
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-500 bg-blue-500/10 text-xs">
              Pauses
            </Badge>
            <Badge variant="outline" className="border-[#00F38D]/30 text-[#00F38D] bg-[#00F38D]/10 text-xs">
              Good
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-y-auto pr-4 space-y-4">
          {segments.map((segment) => (
            <div key={segment.id} className="flex gap-3 p-3 bg-[#050505] rounded-lg border border-white/5">
              <span className="text-xs text-zinc-500 font-mono flex-shrink-0 pt-0.5">
                {segment.timestamp}
              </span>
              <p className="text-sm text-zinc-300 leading-relaxed">
                <HighlightedText text={segment.text} highlights={segment.highlights} />
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
