"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { scenarios } from "@/data/scenarios";
import { CategoryIcon } from "@/components/dashboard/scenario-card";
import type { DifficultyLevel } from "@/types/scenario.types";
import {
  ArrowLeft,
  Bot,
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  EASY:   "text-emerald-400",
  MEDIUM: "text-yellow-400",
  HARD:   "text-orange-400",
  EXPERT: "text-red-400",
};

type SessionState = "ready" | "active" | "ended";

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const scenario = scenarios.find((s) => s.id === id);

  const [sessionState, setSessionState] = useState<SessionState>("ready");
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Timer while session is active
  useEffect(() => {
    if (sessionState !== "active") return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [sessionState]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-white">
        <p className="text-white/40 text-sm mb-4">Scenario not found.</p>
        <button
          onClick={() => router.push("/dashboard/practice")}
          className="text-[#00F38D] text-sm font-semibold hover:underline"
        >
          Back to Practice
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
        <button
          onClick={() => router.push("/dashboard/practice")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Practice
        </button>

        {sessionState === "active" && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400 font-mono">{formatTime(elapsed)}</span>
          </div>
        )}
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row gap-0 overflow-hidden">

        {/* Left panel — scenario info */}
        <aside className="w-full md:w-80 lg:w-96 shrink-0 border-b md:border-b-0 md:border-r border-white/8 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
          {/* Category + title */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <CategoryIcon category={scenario.category} className="w-4 h-4 text-[#00F38D]" />
              </div>
              <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">
                {scenario.category}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white leading-tight mb-1">
              {scenario.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3 text-white/25" />
              <span className="text-xs text-white/30">{scenario.duration}</span>
              <span className={cn("text-[10px] font-bold uppercase tracking-wider ml-1", DIFFICULTY_COLORS[scenario.difficulty])}>
                · {scenario.difficulty}
              </span>
            </div>
          </div>

          {/* AI Role */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#00F38D]/5 border border-[#00F38D]/15">
            <Bot className="w-4 h-4 text-[#00F38D] mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-[#00F38D] uppercase tracking-wider mb-1">AI plays</p>
              <p className="text-sm font-semibold text-white">{scenario.aiRole}</p>
            </div>
          </div>

          {/* What to expect */}
          <div>
            <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-3">
              What to expect
            </p>
            <ul className="space-y-2">
              {scenario.whatToExpect.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00F38D]/50 mt-0.5 shrink-0" />
                  <span className="text-xs text-white/40 leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-3">
              Skills trained
            </p>
            <div className="flex flex-wrap gap-1.5">
              {scenario.trains.map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/8 text-[11px] text-white/40 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Right panel — voice session area */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">

          {/* Ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,243,141,0.04)_0%,transparent_70%)] pointer-events-none" />

          {/* ── READY STATE ─────────────────────────────────────────────── */}
          {sessionState === "ready" && (
            <div className="relative z-10 flex flex-col items-center text-center max-w-sm animate-in fade-in duration-500">
              <div className="w-20 h-20 rounded-full bg-[#00F38D]/10 border border-[#00F38D]/20 flex items-center justify-center mb-6">
                <Bot className="w-9 h-9 text-[#00F38D]" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-3">Ready to begin?</h2>
              <p className="text-sm text-white/45 leading-relaxed mb-8">
                The AI will take on the role of{" "}
                <span className="text-white font-semibold">{scenario.aiRole}</span> and respond
                dynamically to everything you say. Speak naturally.
              </p>
              <button
                id="begin-session"
                onClick={() => setSessionState("active")}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#00F38D] text-black font-bold text-base hover:bg-[#00f38d]/90 transition-all hover:shadow-[0_0_32px_rgba(0,243,141,0.35)] active:scale-95"
              >
                <Mic className="w-4 h-4" />
                Begin Session
              </button>
              <p className="text-xs text-white/20 mt-4">
                Your microphone will be requested when you click Begin.
              </p>
            </div>
          )}

          {/* ── ACTIVE STATE ─────────────────────────────────────────────── */}
          {sessionState === "active" && (
            <div className="relative z-10 flex flex-col items-center w-full max-w-lg animate-in fade-in duration-500">
              {/* AI speaking indicator */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-[#00F38D]/10 border-2 border-[#00F38D]/30 flex items-center justify-center">
                  <Bot className="w-10 h-10 text-[#00F38D]" />
                </div>
                {/* Pulse rings */}
                <div className="absolute inset-0 rounded-full border border-[#00F38D]/20 animate-ping" />
                <div className="absolute -inset-3 rounded-full border border-[#00F38D]/10 animate-ping [animation-delay:0.3s]" />
              </div>

              <p className="text-sm font-semibold text-[#00F38D] mb-1">AI is listening…</p>
              <p className="text-xs text-white/30 mb-10">{scenario.aiRole}</p>

              {/* Transcript placeholder */}
              {/* TODO: Replace with real Vapi/Gemini transcript stream */}
              <div className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/8 mb-8 min-h-[100px] flex items-center justify-center">
                <p className="text-sm text-white/20 italic text-center">
                  Transcript will appear here during the session…
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMuted((m) => !m)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border transition-all",
                    muted
                      ? "bg-red-500/15 border-red-500/30 text-red-400"
                      : "bg-white/8 border-white/15 text-white/60 hover:bg-white/12"
                  )}
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setSessionState("ended")}
                  className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all"
                  aria-label="End session"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-white/20 mt-4">Press the red button to end the session.</p>
            </div>
          )}

          {/* ── ENDED STATE ──────────────────────────────────────────────── */}
          {sessionState === "ended" && (
            <div className="relative z-10 flex flex-col items-center text-center max-w-sm animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full bg-[#00F38D]/10 border border-[#00F38D]/20 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-7 h-7 text-[#00F38D]" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Session Complete</h2>
              <p className="text-sm text-white/40 mb-2">
                Duration: <span className="text-white font-mono">{formatTime(elapsed)}</span>
              </p>
              <p className="text-sm text-white/40 mb-8">
                {/* TODO: Replace with real AI feedback summary from Vapi/Gemini session result */}
                Your feedback report will appear here after session analysis is complete.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => { setSessionState("ready"); setElapsed(0); }}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 font-semibold hover:bg-white/10 hover:text-white transition-all"
                >
                  Practice Again
                </button>
                <button
                  onClick={() => router.push("/dashboard/practice")}
                  className="flex-1 py-2.5 rounded-lg bg-[#00F38D] text-black text-sm font-bold hover:bg-[#00F38D]/90 transition-all"
                >
                  Back to Scenarios
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
