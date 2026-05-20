import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Brain, Info } from "lucide-react";
import { cn } from "@/lib/utils";

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
  skillLevel: string | null;
  setSkillLevel: (val: string) => void;
  coachingStyle: string | null;
  setCoachingStyle: (val: string) => void;
  speakingGoals: string[];
  setSpeakingGoals: (val: string[]) => void;
  feedbackDetail: string | null;
  setFeedbackDetail: (val: string) => void;
  coachingTone: string | null;
  setCoachingTone: (val: string) => void;
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
}: CoachingBehaviorCardProps) {
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

        {/* ── Feedback Settings ─────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Feedback Settings</span>
          </div>

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
        </div>

      </CardContent>
    </Card>
  );
}
