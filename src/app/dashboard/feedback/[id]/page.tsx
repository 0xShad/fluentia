"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { FeedbackHeader } from "../components/feedback-header";
import { MetricCard } from "../components/metric-card";
import { AISuggestionCard } from "../components/ai-suggestion-card";
import { FeedbackSkeleton } from "../components/feedback-skeleton";
import type { Suggestion } from "../components/ai-suggestion-card";
import { Volume2, Shield, Zap, Briefcase, ArrowLeft, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Fluency: Volume2,
  Clarity: Zap,
  Confidence: Shield,
  Professionalism: Briefcase,
};

interface SessionRow {
  id: string;
  scenario_title: string;
  category: string;
  overall_score: number;
  grade: string;
  summary: string;
  strengths: string[];
  improvements: { title: string; description: string; example?: string }[];
  filler_words: { word: string; count: number }[];
  categories: { name: string; score: number; feedback: string }[];
  transcript: { speaker: string; text: string }[];
  elapsed_seconds: number;
  created_at: string;
}

export default function FeedbackDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<SessionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("session_feedback")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setSession(data as SessionRow);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <FeedbackSkeleton />;

  if (notFound || !session) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40 text-sm gap-4 py-24">
        <p>Session not found.</p>
        <button
          onClick={() => router.push("/dashboard/sessions")}
          className="text-[#00F38D] hover:underline"
        >
          Back to Sessions
        </button>
      </div>
    );
  }

  const suggestions: Suggestion[] = [
    ...(session.strengths ?? []).map((s, i) => ({
      id: `strength-${i}`,
      type: "strength" as const,
      message: s,
    })),
    ...(session.improvements ?? []).map((imp, i) => ({
      id: `improvement-${i}`,
      type: "improvement" as const,
      message: imp.description,
      context: imp.example,
    })),
  ];

  const sessionDate = new Date(session.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 animate-in fade-in duration-500 w-full max-w-6xl mx-auto">
      <button
        onClick={() => router.push("/dashboard/sessions")}
        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sessions
      </button>

      <FeedbackHeader
        sessionTitle={session.scenario_title}
        sessionDate={sessionDate}
        overallScore={session.overall_score}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(session.categories ?? []).map((cat) => (
          <MetricCard
            key={cat.name}
            title={cat.name}
            score={cat.score}
            icon={CATEGORY_ICONS[cat.name] ?? Shield}
            description={cat.feedback}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AISuggestionCard suggestions={suggestions} />

        <div className="bg-[#111] border border-white/10 rounded-xl shadow-xl shadow-black/20 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#00F38D]/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#00F38D]" />
            </div>
            <h3 className="text-lg font-semibold text-white">Session Transcript</h3>
          </div>
          <div className="h-[400px] overflow-y-auto space-y-3 pr-1 flex flex-col">
            {(session.transcript ?? []).length === 0 ? (
              <p className="text-sm text-white/20 italic text-center py-8">No transcript recorded.</p>
            ) : (
              (session.transcript ?? []).map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col gap-1 max-w-[85%]",
                    line.speaker === "User" ? "self-end items-end ml-auto" : "self-start items-start"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    line.speaker === "AI" ? "text-[#00F38D]" : "text-white/30"
                  )}>
                    {line.speaker === "AI" ? "AI" : "You"}
                  </span>
                  <div className={cn(
                    "px-3 py-2 rounded-xl text-sm leading-relaxed",
                    line.speaker === "AI"
                      ? "bg-white/5 border border-white/8 text-white/80 rounded-tl-sm"
                      : "bg-[#00F38D]/10 border border-[#00F38D]/15 text-[#00F38D]/90 rounded-tr-sm"
                  )}>
                    {line.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {(session.filler_words ?? []).length > 0 && (
        <div className="p-4 rounded-xl bg-[#111] border border-white/10">
          <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-3">
            Filler Words Detected
          </p>
          <div className="flex flex-wrap gap-2">
            {session.filler_words.map((fw) => (
              <span
                key={fw.word}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs"
              >
                <span className="text-amber-300 font-semibold">&ldquo;{fw.word}&rdquo;</span>
                <span className="text-amber-400/60">×{fw.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
