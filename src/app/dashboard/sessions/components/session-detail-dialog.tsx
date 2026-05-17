"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/client";
import { cn } from "@/lib/utils";
import {
  Play, Pause, Loader2, Clock, Calendar, TrendingUp,
  AlertCircle, CheckCircle2, Mic, X, Bot, User,
} from "lucide-react";

interface SessionDetail {
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
  vapi_call_id: string | null;
  recording_url: string | null;
  recording_enabled: boolean;
}

type RecordingState = "idle" | "loading" | "ready" | "processing" | "unavailable";

function scoreColor(score: number) {
  if (score >= 80) return "#00F38D";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

function gradeStyle(grade: string) {
  if (grade.startsWith("A")) return "text-[#00F38D] border-[#00F38D]/40 bg-[#00F38D]/10";
  if (grade.startsWith("B")) return "text-blue-400 border-blue-400/40 bg-blue-400/10";
  if (grade.startsWith("C")) return "text-amber-400 border-amber-400/40 bg-amber-400/10";
  return "text-red-400 border-red-400/40 bg-red-400/10";
}

function formatDuration(s: number) {
  if (!s || s <= 0) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return sec > 0 ? `${m}m ${sec}s` : `${m}m`;
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  } catch {
    return d;
  }
}

function ScoreRing({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDisplayed(score), 200);
    return () => clearTimeout(t);
  }, [score]);
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (displayed / 100) * circ;
  const color = scoreColor(score);
  return (
    <div style={{ position: "relative", width: 112, height: 112, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", transform: "rotate(-90deg)" }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        <div style={{ fontSize: "1.875rem", fontWeight: 900, color: "white", lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>/100</div>
      </div>
    </div>
  );
}

function AudioPlayer({ url, onDurationLoad }: { url: string; onDurationLoad?: (seconds: number) => void }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { await audio.play(); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio?.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#00F38D]/5 border border-[#00F38D]/20">
      <audio ref={audioRef} src={url} preload="metadata"
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (!a?.duration) return;
          setCurrentTime(a.currentTime);
          setProgress((a.currentTime / a.duration) * 100);
        }}
        onLoadedMetadata={() => {
          const d = audioRef.current?.duration ?? 0;
          setDuration(d);
          onDurationLoad?.(Math.round(d));
        }}
        onEnded={() => { setPlaying(false); setProgress(100); }}
      />
      <button onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-[#00F38D] flex items-center justify-center text-black hover:bg-[#00F38D]/90 active:scale-95 transition-all shrink-0 shadow-[0_0_20px_rgba(0,243,141,0.3)]"
      >
        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </button>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#00F38D]">Session Recording</span>
          <span className="text-[10px] text-white/20 ml-auto">Resets on the 1st of each month</span>
          {playing && (
            <span className="flex gap-0.5 items-end h-3">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="w-0.5 bg-[#00F38D] rounded-full animate-bounce"
                  style={{ height: `${40 + i * 15}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </span>
          )}
        </div>
        <div className="h-2 bg-white/10 rounded-full cursor-pointer overflow-hidden" onClick={seek}>
          <div className="h-full bg-[#00F38D] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[11px] text-white/30 font-mono">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
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
  const barColor = score >= 80 ? "bg-[#00F38D]" : score >= 60 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-white/70">{name}</span>
        <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor(score) }}>{score}</span>
      </div>
      <div className="h-2 bg-white/6 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
          style={{ width: `${w}%`, transitionDelay: `${delay}ms` }} />
      </div>
      <p className="text-xs text-white/35 leading-relaxed">{feedback}</p>
    </div>
  );
}

interface Props {
  sessionId: string | null;
  onClose: () => void;
}

export function SessionDetailDialog({ sessionId, onClose }: Props) {
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) { setSession(null); setRecordingState("idle"); setResolvedUrl(null); setAudioDuration(null); return; }
    setLoading(true);
    setRecordingState("idle");
    setResolvedUrl(null);
    setAudioDuration(null);
    createClient()
      .from("session_feedback")
      .select("*")
      .eq("id", sessionId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setSession(data as SessionDetail);
        setLoading(false);
      });
  }, [sessionId]);

  useEffect(() => {
    if (!session) return;
    if (!session.recording_enabled) {
      setRecordingState("unavailable");
      return;
    }
    if (!session.vapi_call_id && !session.recording_url) {
      setRecordingState("unavailable");
      return;
    }
    setRecordingState("loading");
    fetch("/api/recording", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "ready" && data.signedUrl) {
          setResolvedUrl(data.signedUrl);
          setRecordingState("ready");
        } else {
          setRecordingState("processing");
        }
      })
      .catch(() => setRecordingState("unavailable"));
  }, [session]);

  if (!sessionId) return null;

  return (
    <>
    <style>{`
      .sdlg-scroll::-webkit-scrollbar { width: 3px; height: 3px; }
      .sdlg-scroll::-webkit-scrollbar-track { background: transparent; }
      .sdlg-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 9999px; }
      .sdlg-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }
    `}</style>
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        style={{
          position: "relative",
          width: "min(95vw, 1500px)",
          maxWidth: "1500px",
          height: "92vh",
          background: "#080808",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {loading || !session ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Loader2 style={{ width: 28, height: 28, color: "#00F38D", animation: "spin 1s linear infinite" }} />
          </div>
        ) : (
          <>
            {/* ── HEADER ── */}
            <div style={{ flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#0A0A0A" }}>
              {/* Top row: score ring + title + close */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.5rem 2rem 1rem" }}>
                <ScoreRing score={session.overall_score} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                      {session.category}
                    </span>
                    <span className={cn("px-2.5 py-0.5 rounded-full border text-xs font-extrabold tracking-wide", gradeStyle(session.grade))}>
                      {session.grade}
                    </span>
                  </div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", lineHeight: 1.2, margin: 0 }}>
                    {session.scenario_title}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.375rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                      <Clock style={{ width: 13, height: 13 }} />
                      {formatDuration(audioDuration ?? session.elapsed_seconds)}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                      <Calendar style={{ width: 13, height: 13 }} />
                      {formatDate(session.created_at)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)"; }}
                >
                  <X style={{ width: 15, height: 15 }} />
                </button>
              </div>

              {/* Full-width recording row */}
              <div style={{ padding: "0 2rem 1.5rem" }}>
                {recordingState === "ready" && resolvedUrl ? (
                  <AudioPlayer url={resolvedUrl} onDurationLoad={setAudioDuration} />
                ) : recordingState === "loading" ? (
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/3 border border-white/8 text-sm text-white/40">
                    <Loader2 className="w-4 h-4 animate-spin text-[#00F38D] shrink-0" />
                    {session.recording_url ? "Loading recording…" : "Saving recording to storage for the first time…"}
                  </div>
                ) : recordingState === "processing" ? (
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-amber-400/5 border border-amber-400/15 text-sm text-amber-400/70">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    Recording is still processing — check back in a minute.
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/2 border border-white/8 text-sm text-white/20">
                    <Mic className="w-4 h-4 shrink-0" />
                    {session.recording_enabled === false
                      ? "Recording was disabled for this session."
                      : "No recording available for this session."}
                  </div>
                )}
              </div>
            </div>

            {/* ── BODY ── */}
            <div style={{ flex: 1, overflow: "hidden", display: "flex", minHeight: 0 }}>
              {/* Left: feedback */}
              <div className="sdlg-scroll" style={{ width: "42%", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.08)", overflowY: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                {session.summary && (
                  <div>
                    <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-3">Summary</p>
                    <p className="text-sm text-white/55 leading-relaxed">{session.summary}</p>
                  </div>
                )}

                {(session.categories ?? []).length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-4">Performance</p>
                    <div className="space-y-5">
                      {session.categories.map((cat, i) => (
                        <CategoryBar key={cat.name} name={cat.name} score={cat.score} feedback={cat.feedback} delay={100 + i * 80} />
                      ))}
                    </div>
                  </div>
                )}

                {(session.strengths ?? []).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-3.5 h-3.5 text-[#00F38D]" />
                      <p className="text-[11px] font-bold text-[#00F38D] uppercase tracking-widest">Strengths</p>
                    </div>
                    <ul className="space-y-2.5">
                      {session.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00F38D]/50 mt-0.5 shrink-0" />
                          <span className="text-sm text-white/60 leading-relaxed">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(session.improvements ?? []).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Areas to Improve</p>
                    </div>
                    <ul className="space-y-4">
                      {session.improvements.map((item, i) => (
                        <li key={i} className="pl-3 border-l-2 border-white/8 space-y-1">
                          <p className="text-sm font-semibold text-white/75">{item.title}</p>
                          <p className="text-xs text-white/40 leading-relaxed">{item.description}</p>
                          {item.example && (
                            <p className="text-xs text-white/25 italic mt-1">&ldquo;{item.example}&rdquo;</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(session.filler_words ?? []).length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-3">Filler Words</p>
                    <div className="flex flex-wrap gap-2">
                      {session.filler_words.map((fw) => (
                        <span key={fw.word} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs">
                          <span className="text-amber-300 font-bold">&ldquo;{fw.word}&rdquo;</span>
                          <span className="text-amber-400/50">×{fw.count}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: transcript */}
              <div className="sdlg-scroll" style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
                <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest mb-5">Conversation Transcript</p>

                {(session.transcript ?? []).length === 0 ? (
                  <p className="text-sm italic text-white/20 text-center py-16">No transcript recorded.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {(session.transcript ?? []).map((line, i) => {
                      if (line.speaker === "System") {
                        return (
                          <div key={i} className="flex items-center gap-3 opacity-30 py-1">
                            <div className="flex-1 h-px bg-white/20" />
                            <span className="text-[10px] text-white/50 uppercase tracking-widest font-medium whitespace-nowrap">dead air</span>
                            <div className="flex-1 h-px bg-white/20" />
                          </div>
                        );
                      }
                      const isAI = line.speaker === "AI";
                      return (
                        <div key={i} className={cn("flex gap-3 max-w-[90%]", isAI ? "self-start" : "self-end flex-row-reverse")}>
                          <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                            isAI ? "bg-[#00F38D]/15 border border-[#00F38D]/25" : "bg-white/8 border border-white/15"
                          )}>
                            {isAI ? <Bot className="w-3.5 h-3.5 text-[#00F38D]" /> : <User className="w-3.5 h-3.5 text-white/50" />}
                          </div>
                          <div className="space-y-1">
                            <span className={cn("text-[10px] font-bold uppercase tracking-wider block",
                              isAI ? "text-[#00F38D]/70" : "text-white/30 text-right"
                            )}>
                              {isAI ? "AI Coach" : "You"}
                            </span>
                            <div className={cn("px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                              isAI
                                ? "bg-white/5 border border-white/8 text-white/80 rounded-tl-sm"
                                : "bg-[#00F38D]/10 border border-[#00F38D]/15 text-[#00F38D]/90 rounded-tr-sm"
                            )}>
                              {line.text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
}
