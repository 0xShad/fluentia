import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, User, Check, Play, Square, Brain, Info } from "lucide-react";
import { VOICE_OPTIONS, type VoiceOption } from "@/lib/voice/voice-options";
import { cn } from "@/lib/utils";
import { useState, useRef, useCallback } from "react";

const SPEAKING_GOALS = [
  "Improve Fluency",
  "Build Confidence",
  "Reduce Filler Words",
  "Improve Clarity",
  "Expand Vocabulary",
  "Better Pacing",
  "Professional Tone",
];

interface CoachingBehaviorCardProps {
  // Learning profile
  skillLevel: string | null;
  setSkillLevel: (val: string) => void;
  coachingStyle: string | null;
  setCoachingStyle: (val: string) => void;
  speakingGoals: string[];
  setSpeakingGoals: (val: string[]) => void;
  // Session behavior
  feedbackDetail: string | null;
  setFeedbackDetail: (val: string) => void;
  coachingTone: string | null;
  setCoachingTone: (val: string) => void;
  correctionSensitivity: readonly number[];
  setCorrectionSensitivity: (val: readonly number[]) => void;
  preferredVoice: string;
  setPreferredVoice: (val: string) => void;
}

const GENDER_COLORS = {
  male:    "text-blue-400 bg-blue-400/10 border-blue-400/20",
  female:  "text-pink-400 bg-pink-400/10 border-pink-400/20",
  neutral: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
};

const PREVIEW_TEXT = "Hello! I'm your AI communication coach, ready to help you practice.";

function previewVoice(voice: VoiceOption): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(PREVIEW_TEXT);
  utterance.rate = 0.95;

  if (voice.gender === "male") {
    utterance.pitch = 0.75;
    utterance.rate = 0.9;
  } else if (voice.gender === "female") {
    utterance.pitch = 1.25;
  } else {
    utterance.pitch = 1.0;
  }

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const lc = (s: string) => s.toLowerCase();
    let match: SpeechSynthesisVoice | undefined;

    if (voice.gender === "male") {
      match =
        voices.find((v) => lc(v.name).includes("male")) ||
        voices.find((v) => ["david", "daniel", "alex", "mark", "george", "fred", "james", "ryan", "oliver"].some((n) => lc(v.name).includes(n)));
    } else if (voice.gender === "female") {
      match =
        voices.find((v) => lc(v.name).includes("female")) ||
        voices.find((v) => ["samantha", "victoria", "karen", "zira", "susan", "sarah", "nova", "allison", "fiona"].some((n) => lc(v.name).includes(n)));
    }

    if (match) utterance.voice = match;
  }

  return utterance;
}

export function CoachingBehaviorCard({
  skillLevel,
  setSkillLevel,
  coachingStyle,
  setCoachingStyle,
  speakingGoals,
  setSpeakingGoals,
  feedbackDetail,
  setFeedbackDetail,
  coachingTone,
  setCoachingTone,
  correctionSensitivity,
  setCorrectionSensitivity,
  preferredVoice,
  setPreferredVoice,
}: CoachingBehaviorCardProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handlePreview = useCallback((voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();

    if (playingId === voice.id) {
      setPlayingId(null);
      return;
    }

    const utterance = previewVoice(voice);
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    utteranceRef.current = utterance;

    setPlayingId(voice.id);
    window.speechSynthesis.speak(utterance);
  }, [playingId]);

  const toggleGoal = (goal: string) => {
    setSpeakingGoals(
      speakingGoals.includes(goal)
        ? speakingGoals.filter((g) => g !== goal)
        : [...speakingGoals, goal]
    );
  };

  return (
    <Card id="coaching-behavior" className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20 scroll-mt-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-purple-400" />
          Feedback & Scoring Settings
        </CardTitle>
        <CardDescription className="text-zinc-400">Controls how your performance is scored and how your post-session feedback report reads.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* ── Info callout ─────────────────────────────────────── */}
        <div className="flex items-start gap-3 rounded-lg border border-white/8 bg-white/3 px-4 py-3">
          <Info className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
          <p className="text-xs text-white/40 leading-relaxed">
            These settings control <span className="text-white/60 font-medium">scoring and post-session feedback</span> only.
            To change how the AI sounds during a live session, use the <span className="text-white/60 font-medium">persona picker</span> on the practice page before starting.
          </p>
        </div>

        {/* ── Learning Profile ─────────────────────────────────── */}
        <div className="space-y-4 pb-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Your Learning Profile</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">Skill Level</Label>
              <Select value={skillLevel || undefined} onValueChange={(val) => val && setSkillLevel(val)}>
                <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-purple-500/20 focus:border-purple-500">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  <SelectItem value="beginner" className="focus:bg-white/10 focus:text-white">Beginner</SelectItem>
                  <SelectItem value="intermediate" className="focus:bg-white/10 focus:text-white">Intermediate</SelectItem>
                  <SelectItem value="advanced" className="focus:bg-white/10 focus:text-white">Advanced</SelectItem>
                  <SelectItem value="native" className="focus:bg-white/10 focus:text-white">Native / Fluent</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-zinc-500">Calibrates scoring difficulty — beginner scores are scaled up, advanced scores are held to a higher bar.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">Evaluation Style</Label>
              <Select value={coachingStyle || undefined} onValueChange={(val) => val && setCoachingStyle(val)}>
                <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-purple-500/20 focus:border-purple-500">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  <SelectItem value="encouraging" className="focus:bg-white/10 focus:text-white">Encouraging & Patient</SelectItem>
                  <SelectItem value="balanced" className="focus:bg-white/10 focus:text-white">Balanced & Natural</SelectItem>
                  <SelectItem value="analytical" className="focus:bg-white/10 focus:text-white">Analytical & Precise</SelectItem>
                  <SelectItem value="strict" className="focus:bg-white/10 focus:text-white">Strict & Demanding</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-zinc-500">How the AI weighs and frames your scores and written feedback after each session.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Speaking Goals <span className="text-zinc-600">(select all that apply)</span></Label>
            <div className="flex flex-wrap gap-2">
              {SPEAKING_GOALS.map((goal) => {
                const active = speakingGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                      active
                        ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
                        : "bg-[#050505] border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                    )}
                  >
                    {active && <span className="mr-1">✓</span>}
                    {goal}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-zinc-500">Your feedback report focuses on and weights scores toward these areas.</p>
          </div>
        </div>

        {/* ── Session Behavior ─────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Feedback Settings</span>
          </div>

          {/* Feedback detail + Feedback tone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">Feedback Detail Level</Label>
              <Select value={feedbackDetail || undefined} onValueChange={(val) => val && setFeedbackDetail(val)}>
                <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-purple-500/20 focus:border-purple-500">
                  <SelectValue placeholder="Select Detail" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  <SelectItem value="minimal" className="focus:bg-white/10 focus:text-white">Minimal (Core fixes)</SelectItem>
                  <SelectItem value="standard" className="focus:bg-white/10 focus:text-white">Standard (Balanced)</SelectItem>
                  <SelectItem value="detailed" className="focus:bg-white/10 focus:text-white">Detailed (In-depth analysis)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-400">Feedback Tone</Label>
              <Select value={coachingTone || undefined} onValueChange={(val) => val && setCoachingTone(val)}>
                <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-purple-500/20 focus:border-purple-500">
                  <SelectValue placeholder="Select Tone" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/10 text-white">
                  <SelectItem value="encouraging" className="focus:bg-white/10 focus:text-white">Encouraging & Warm</SelectItem>
                  <SelectItem value="balanced" className="focus:bg-white/10 focus:text-white">Balanced (Objective)</SelectItem>
                  <SelectItem value="direct" className="focus:bg-white/10 focus:text-white">Direct & Precise</SelectItem>
                  <SelectItem value="strict" className="focus:bg-white/10 focus:text-white">Strict Remediation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Speech correction sensitivity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-zinc-400">Speech Correction Sensitivity</Label>
              <span className="text-xs font-bold text-purple-400">{correctionSensitivity[0]}%</span>
            </div>
            <Slider
              value={correctionSensitivity as number[]}
              onValueChange={(val) => {
                const next = Array.isArray(val) ? (val as readonly number[]) : ([val] as readonly number[]);
                setCorrectionSensitivity(next);
              }}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>Lenient (major errors only)</span>
              <span>Strict (flag minor slips)</span>
            </div>
            <p className="text-[10px] text-zinc-500">Lower values only flag significant, repeated errors. Higher values flag even minor slips.</p>
          </div>
        </div>

        {/* ── AI Voice picker ───────────────────────────────────── */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <div>
            <Label className="text-sm">AI Coach Voice</Label>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Choose the voice your AI coach speaks in. Hit <Play className="inline w-2.5 h-2.5 mx-0.5" /> to preview.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {VOICE_OPTIONS.map((voice) => {
              const isSelected = preferredVoice === voice.id;
              const isPlaying = playingId === voice.id;

              return (
                <div
                  key={voice.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setPreferredVoice(voice.id)}
                  onKeyDown={(e) => e.key === "Enter" || e.key === " " ? setPreferredVoice(voice.id) : undefined}
                  className={cn(
                    "relative flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200 cursor-pointer",
                    isSelected
                      ? "bg-[#00F38D]/8 border-[#00F38D]/40"
                      : "bg-[#050505] border-white/8 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-xs font-bold",
                    GENDER_COLORS[voice.gender]
                  )}>
                    <User className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className={cn(
                        "text-sm font-semibold leading-none",
                        isSelected ? "text-[#00F38D]" : "text-white"
                      )}>
                        {voice.label}
                      </p>
                      <span className="text-[9px] text-zinc-600 uppercase tracking-wider">{voice.accent}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{voice.description}</p>
                  </div>

                  <button
                    onClick={(e) => handlePreview(voice, e)}
                    className={cn(
                      "shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all",
                      isPlaying
                        ? "bg-[#00F38D]/20 text-[#00F38D]"
                        : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                    )}
                    title={isPlaying ? "Stop" : "Preview voice"}
                  >
                    {isPlaying
                      ? <Square className="w-2.5 h-2.5 fill-current" />
                      : <Play className="w-2.5 h-2.5 fill-current" />
                    }
                  </button>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00F38D] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                    </div>
                  )}

                  {isPlaying && (
                    <span className="absolute bottom-2 left-3 flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-0.5 rounded-full bg-[#00F38D] animate-bounce"
                          style={{ height: `${8 + i * 3}px`, animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-zinc-600">
            Preview uses your browser&apos;s built-in voice (pitch-adjusted per gender). Sessions use premium AI voices.
          </p>
        </div>

      </CardContent>
    </Card>
  );
}
