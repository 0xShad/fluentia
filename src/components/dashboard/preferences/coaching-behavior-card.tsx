import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2 } from "lucide-react";

interface CoachingBehaviorCardProps {
  realtimeHints: boolean;
  setRealtimeHints: (val: boolean) => void;
  feedbackDetail: string | null;
  setFeedbackDetail: (val: string) => void;
  coachingTone: string | null;
  setCoachingTone: (val: string) => void;
  correctionSensitivity: readonly number[];
  setCorrectionSensitivity: (val: readonly number[]) => void;
}

export function CoachingBehaviorCard({
  realtimeHints,
  setRealtimeHints,
  feedbackDetail,
  setFeedbackDetail,
  coachingTone,
  setCoachingTone,
  correctionSensitivity,
  setCorrectionSensitivity
}: CoachingBehaviorCardProps) {
  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
      <CardHeader>
          <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-purple-400" />
          AI Coaching Behavior
        </CardTitle>
        <CardDescription className="text-zinc-400">Customize how your AI coach evaluates and provides feedback.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#050505] p-4">
          <div className="space-y-0.5">
            <Label className="text-sm">Real-time Coaching Hints</Label>
            <p className="text-[10px] text-zinc-500">Display visual pacing/filler-word alerts instantly while you speak.</p>
          </div>
          <Switch 
            checked={realtimeHints} 
            onCheckedChange={setRealtimeHints} 
            className="data-[state=checked]:bg-purple-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Feedback Detail Level</Label>
            <Select value={feedbackDetail || undefined} onValueChange={setFeedbackDetail}>
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
            <Label className="text-xs text-zinc-400">Coaching Tone</Label>
            <Select value={coachingTone || undefined} onValueChange={setCoachingTone}>
              <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-purple-500/20 focus:border-purple-500">
                <SelectValue placeholder="Select Tone" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                <SelectItem value="encouraging" className="focus:bg-white/10 focus:text-white">Encouraging & Gentle</SelectItem>
                <SelectItem value="neutral" className="focus:bg-white/10 focus:text-white">Neutral (Objective)</SelectItem>
                <SelectItem value="strict" className="focus:bg-white/10 focus:text-white">Strict Remediation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-zinc-400">Speech Correction Sensitivity</Label>
            <span className="text-xs text-purple-400">{correctionSensitivity[0]}% strictness</span>
          </div>
          <Slider 
            value={correctionSensitivity as number[]}
            onValueChange={setCorrectionSensitivity}
            max={100} 
            step={1} 
            className="w-full [&_[role=slider]]:bg-purple-500 [&_[data-orientation=horizontal]>span]:bg-purple-500/20"
          />
          <p className="text-[10px] text-zinc-500 pt-1">Lower values allow for minor grammatical errors to pass without triggering immediate correction.</p>
        </div>

      </CardContent>
    </Card>
  );
}
