"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { scenarios } from "@/data/scenarios";
import { CategoryIcon } from "@/components/dashboard/scenario-card";
import type { DifficultyLevel } from "@/types/scenario.types";
import type { SessionFeedback } from "@/types/feedback.types";
import type { UserPreferences } from "@/types/user-preferences.types";
import {
  ArrowLeft,
  Bot,
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVapiSession } from "@/hooks/use-vapi-session";
import { useRecordingConsent } from "@/hooks/use-recording-consent";
import { RecordingConsentDialog } from "@/components/dashboard/recording-consent-dialog";
import { createClient } from "@/lib/client";

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  EASY:   "text-emerald-400",
  MEDIUM: "text-yellow-400",
  HARD:   "text-orange-400",
  EXPERT: "text-red-400",
};

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return "text-[#00F38D] border-[#00F38D]/30 bg-[#00F38D]/10";
  if (grade.startsWith("B")) return "text-blue-400 border-blue-400/30 bg-blue-400/10";
  if (grade.startsWith("C")) return "text-amber-400 border-amber-400/30 bg-amber-400/10";
  return "text-red-400 border-red-400/30 bg-red-400/10";
}

function scoreColor(score: number) {
  if (score >= 80) return "#00F38D";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

function ScoreRing({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDisplayed(score), 150);
    return () => clearTimeout(t);
  }, [score]);

  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (displayed / 100) * circ;
  const color = scoreColor(score);

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1), stroke 0.3s ease" }}
        />
      </svg>
      <div className="relative text-center">
        <div className="text-4xl font-black text-white leading-none">{score}</div>
        <div className="text-[10px] text-white/30 font-semibold uppercase tracking-widest mt-0.5">/ 100</div>
      </div>
    </div>
  );
}

function CategoryBar({ name, score, feedback, delay }: { name: string; score: number; feedback: string; delay: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(score), delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  const color = score >= 80 ? "bg-[#00F38D]" : score >= 60 ? "bg-amber-400" : "bg-red-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-white/50">{name}</span>
        <span className="text-xs font-bold" style={{ color: scoreColor(score) }}>{score}</span>
      </div>
      <div className="h-1.5 bg-white/6 rounded-full overflow-hidden mb-1.5">
        <div
          className={`h-full w-full rounded-full transition-transform duration-1000 ease-out origin-left ${color}`}
          style={{ transform: `scaleX(${w / 100})`, transitionDelay: `${delay}ms` }}
        />
      </div>
      <p className="text-[11px] text-white/30 leading-relaxed">{feedback}</p>
    </div>
  );
}

function FeedbackReport({
  feedback,
  elapsed,
  scenarioTitle,
  onPracticeAgain,
  onBack,
}: {
  feedback: SessionFeedback;
  elapsed: number;
  scenarioTitle: string;
  onPracticeAgain: () => void;
  onBack: () => void;
}) {
  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 animate-in fade-in duration-500 pb-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00F38D]" />
          <span className="text-sm font-bold text-white">Session Complete</span>
        </div>
        <span className="text-xs text-white/30 font-mono">{fmt(elapsed)}</span>
      </div>

      {/* Score + Grade */}
      <div className="flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-white/2 border border-white/8">
        <ScoreRing score={feedback.overallScore} />
        <div className={cn("px-3 py-1 rounded-full border text-xs font-extrabold tracking-wide", gradeColor(feedback.grade))}>
          {feedback.grade}
        </div>
        <p className="text-sm text-white/50 text-center leading-relaxed max-w-md">
          {feedback.summary}
        </p>
      </div>

      {/* Strengths + Improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-[#00F38D]/4 border border-[#00F38D]/15">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-[#00F38D]" />
            <span className="text-[11px] font-bold text-[#00F38D] uppercase tracking-wider">Strengths</span>
          </div>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00F38D]/60 mt-0.5 shrink-0" />
                <span className="text-xs text-white/60 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="p-4 rounded-xl bg-white/2 border border-white/8">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Areas to Improve</span>
          </div>
          <ul className="space-y-3">
            {feedback.improvements.map((item, i) => (
              <li key={i} className="space-y-0.5">
                <p className="text-xs font-semibold text-white/70">{item.title}</p>
                <p className="text-[11px] text-white/40 leading-relaxed">{item.description}</p>
                {item.example && (
                  <p className="text-[11px] text-white/25 italic mt-1 pl-2 border-l border-white/10">
                    &ldquo;{item.example}&rdquo;
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Filler Words */}
      {feedback.fillerWords.length > 0 && (
        <div className="p-4 rounded-xl bg-white/2 border border-white/8">
          <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-3">
            Filler Words Detected
          </p>
          <div className="flex flex-wrap gap-2">
            {feedback.fillerWords.map((fw) => (
              <span
                key={fw.word}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs"
              >
                <span className="text-amber-300 font-semibold">&ldquo;{fw.word}&rdquo;</span>
                <span className="text-amber-400/60">×{fw.count}</span>
              </span>
            ))}
          </div>
          <p className="text-[11px] text-white/25 mt-2 leading-relaxed">
            Filler words disrupt flow and can signal uncertainty. Practice pausing silently instead.
          </p>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="p-4 rounded-xl bg-white/2 border border-white/8">
        <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-4">
          Performance Breakdown
        </p>
        <div className="space-y-4">
          {feedback.categories.map((cat, i) => (
            <CategoryBar
              key={cat.name}
              name={cat.name}
              score={cat.score}
              feedback={cat.feedback}
              delay={200 + i * 100}
            />
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3">
        <button
          onClick={onPracticeAgain}
          className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 font-semibold hover:bg-white/8 hover:text-white transition-[colors,background-color] duration-150 active:scale-[0.97]"
        >
          Practice Again
        </button>
        <button
          onClick={onBack}
          className="flex-1 py-2.5 rounded-xl bg-[#00F38D] text-black text-sm font-bold hover:bg-[#00F38D]/90 transition-[colors,background-color] duration-150 active:scale-[0.97]"
        >
          Back to Scenarios
        </button>
      </div>
    </div>
  );
}

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const scenario = scenarios.find((s) => s.id === id);

  const {
    status: sessionState,
    isSpeaking,
    isMuted,
    volumeLevel,
    transcript,
    error,
    callId,
    isRecording,
    startCall,
    endCall,
    toggleMute,
    sendTextMessage,
  } = useVapiSession();

  const { consent, saveConsent } = useRecordingConsent();
  const [showConsentDialog, setShowConsentDialog] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [feedback, setFeedback] = useState<SessionFeedback | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [userPrefs, setUserPrefs] = useState<Partial<UserPreferences>>({});

  // Load user preferences once on mount
  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("skill_level, coaching_style, speaking_goals, coaching_tone, feedback_detail, correction_sensitivity, realtime_hints, preferred_voice")
        .eq("user_id", user.id)
        .single();
      if (prefs) setUserPrefs(prefs as Partial<UserPreferences>);
    };
    load();
  }, []);

  // Timer while active
  useEffect(() => {
    if (sessionState !== "active") return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [sessionState]);

  // Fetch feedback when session ends, then kick off recording upload
  useEffect(() => {
    if (sessionState !== "ended" || feedback || feedbackLoading || !scenario) return;
    setFeedbackLoading(true);
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: transcript.map((l) => ({ speaker: l.speaker, text: l.text })),
        scenarioTitle: scenario.title,
        aiRole: scenario.aiRole,
        category: scenario.category,
        scenarioId: id,
        elapsedSeconds: elapsed,
        vapiCallId: callId,
        recordingEnabled: isRecording,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setFeedback(data);
        // Fire-and-forget: upload recording only if user consented
        if (data.sessionId && isRecording) {
          fetch("/api/recording", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: data.sessionId }),
          }).catch((e) => console.error("Recording upload error:", e));
        }
      })
      .catch((e) => console.error("Feedback error:", e))
      .finally(() => setFeedbackLoading(false));
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

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
        <button
          onClick={() => router.push("/dashboard/practice")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Practice
        </button>

        {sessionState === "active" && (
          <div className="flex items-center gap-2.5">
            {isRecording && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Recording</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-400 font-mono">{formatTime(elapsed)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row gap-0 md:overflow-hidden">

        {/* Left panel — scenario info */}
        <aside className="w-full md:w-80 lg:w-96 shrink-0 border-b md:border-b-0 md:border-r border-white/8 p-6 md:p-8 flex flex-col gap-6 md:overflow-y-auto">
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

          <div className="flex items-start gap-3 p-4 rounded-xl bg-[#00F38D]/5 border border-[#00F38D]/15">
            <Bot className="w-4 h-4 text-[#00F38D] mt-0.5 shrink-0" />
            <div>
              <p className="text-[11px] font-bold text-[#00F38D] uppercase tracking-wider mb-1">AI plays</p>
              <p className="text-sm font-semibold text-white">{scenario.aiRole}</p>
            </div>
          </div>

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

        {/* Right panel */}
        <main className={cn(
          "flex-1 flex flex-col items-center p-6 md:p-10 relative",
          sessionState === "ended" ? "overflow-y-auto justify-start" : "justify-center md:overflow-hidden"
        )}>

          {/* Ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,243,141,0.04)_0%,transparent_70%)] pointer-events-none" />

          {/* Consent dialog */}
          <RecordingConsentDialog
            open={showConsentDialog}
            initialDontRecord={consent === "never"}
            initialRemember={consent === "always" || consent === "never"}
            onConfirm={(recordingEnabled, remember) => {
              setShowConsentDialog(false);
              if (remember) {
                saveConsent(recordingEnabled ? "always" : "never");
              } else {
                saveConsent("ask");
              }
              startCall(scenario, userPrefs, recordingEnabled);
            }}
            onCancel={() => setShowConsentDialog(false)}
          />

          {/* ── IDLE / CONNECTING ─────────────────────────────────────── */}
          {(sessionState === "idle" || sessionState === "connecting") && (
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
                onClick={() => setShowConsentDialog(true)}
                disabled={sessionState === "connecting" || consent === null}
                className={cn(
                  "flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-black font-bold text-base transition-[colors,transform,shadow,background-color] duration-150",
                  sessionState === "connecting" || consent === null
                    ? "bg-white/20 cursor-not-allowed"
                    : "bg-[#00F38D] hover:bg-[#00f38d]/90 hover:shadow-[0_0_32px_rgba(0,243,141,0.35)] active:scale-[0.97]"
                )}
              >
                {sessionState === "connecting" ? "Connecting…" : <><Mic className="w-4 h-4" /> Begin Session</>}
              </button>
              <p className="text-xs text-white/20 mt-4">
                Your microphone will be requested when you click Begin.
              </p>
            </div>
          )}

          {/* ── ACTIVE ─────────────────────────────────────────────── */}
          {sessionState === "active" && (
            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl animate-in fade-in duration-500 h-full max-h-full py-8">
              <div className="relative mb-6 shrink-0">
                <div className={cn(
                  "w-20 h-20 rounded-full bg-[#00F38D]/10 border-2 flex items-center justify-center transition-all duration-300",
                  isSpeaking ? "border-[#00F38D]/50 shadow-[0_0_20px_rgba(0,243,141,0.4)]" : "border-[#00F38D]/20"
                )}>
                  <Bot className="w-8 h-8 text-[#00F38D]" />
                </div>
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full border border-[#00F38D]/30 animate-ping" />
                    <div className="absolute -inset-2 rounded-full border border-[#00F38D]/10 animate-ping [animation-delay:0.3s]" />
                  </>
                )}
              </div>

              <p className="text-xs font-semibold text-[#00F38D] mb-1">
                {isSpeaking ? "AI is speaking…" : "AI is listening…"}
              </p>
              <p className="text-xs text-white/30 mb-6">{scenario.aiRole}</p>

              <div className="w-full flex-1 overflow-y-auto p-4 rounded-xl bg-white/2 border border-white/8 mb-6 flex flex-col gap-3">
                {transcript.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-white/20 italic text-center">
                      Transcript will appear here…
                    </p>
                  </div>
                ) : (
                  transcript.map((line, i) => {
                    if (line.speaker === "System") {
                      return (
                        <div key={i} className="flex items-center gap-3 self-center w-full opacity-40 py-1">
                          <div className="flex-1 h-px bg-white/20" />
                          <span className="text-[10px] text-white/50 uppercase tracking-widest font-medium whitespace-nowrap">
                            dead air
                          </span>
                          <div className="flex-1 h-px bg-white/20" />
                        </div>
                      );
                    }
                    return (
                      <div
                        key={i}
                        className={cn(
                          "flex flex-col gap-1 max-w-[85%]",
                          line.speaker === "User" ? "self-end items-end" : "self-start items-start"
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
                    );
                  })
                )}
              </div>

              <div className="flex flex-col items-center shrink-0">
                <div className="flex items-center gap-6 mb-3">
                  <button
                    onClick={toggleMute}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center border transition-all",
                      isMuted
                        ? "bg-red-500/15 border-red-500/30 text-red-400"
                        : "bg-white/8 border-white/15 text-white/60 hover:bg-white/12"
                    )}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={endCall}
                    className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all"
                    aria-label="End session"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00F38D] transition-all duration-75"
                    style={{ width: `${Math.min(volumeLevel * 100 * 3, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── ENDED — loading or feedback ─────────────────────────── */}
          {sessionState === "ended" && (
            <div className="relative z-10 w-full pt-2">
              {feedbackLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-24 animate-in fade-in duration-500">
                  <div className="w-14 h-14 rounded-full bg-[#00F38D]/10 border border-[#00F38D]/20 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#00F38D] animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">Analyzing your performance…</p>
                    <p className="text-xs text-white/30 mt-1">This takes a few seconds</p>
                  </div>
                </div>
              ) : feedback ? (
                <FeedbackReport
                  feedback={feedback}
                  elapsed={elapsed}
                  scenarioTitle={scenario.title}
                  onPracticeAgain={() => window.location.reload()}
                  onBack={() => router.push("/dashboard/practice")}
                />
              ) : (
                // Fallback if API fails
                <div className="flex flex-col items-center text-center max-w-sm mx-auto py-16 animate-in fade-in duration-500">
                  <CheckCircle2 className="w-10 h-10 text-[#00F38D] mb-4" />
                  <h2 className="text-2xl font-extrabold text-white mb-2">Session Complete</h2>
                  <p className="text-sm text-white/40 mb-8">
                    Duration: <span className="text-white font-mono">{formatTime(elapsed)}</span>
                  </p>
                  <div className="flex gap-3 w-full">
                    <button onClick={() => window.location.reload()} className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 font-semibold hover:bg-white/10 transition-all">
                      Practice Again
                    </button>
                    <button onClick={() => router.push("/dashboard/practice")} className="flex-1 py-2.5 rounded-lg bg-[#00F38D] text-black text-sm font-bold hover:bg-[#00F38D]/90 transition-all">
                      Back to Scenarios
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── ERROR ─────────────────────────────────────────────── */}
          {sessionState === "error" && (
            <div className="relative z-10 flex flex-col items-center text-center max-w-sm animate-in fade-in duration-500">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <MicOff className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Microphone Unavailable</h2>
              <p className="text-sm text-white/40 mb-6">{error || "Could not access microphone."}</p>

              <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-left mb-6">
                <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-3">Text Fallback Mode</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your response here…"
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00F38D]/50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && textInput.trim()) {
                        sendTextMessage(textInput);
                        setTextInput("");
                      }
                    }}
                  />
                  <button
                    onClick={() => { if (textInput.trim()) { sendTextMessage(textInput); setTextInput(""); } }}
                    className="px-4 py-2 bg-[#00F38D]/10 text-[#00F38D] rounded-lg text-sm font-semibold hover:bg-[#00F38D]/20 transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="py-2.5 px-6 rounded-lg bg-white/5 border border-white/10 text-sm text-white/60 font-semibold hover:bg-white/10 hover:text-white transition-all"
              >
                Reload and Try Mic Again
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
