import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Info } from "lucide-react";

interface SessionDefaultsCardProps {
  coachingStyle: string | null;
  setCoachingStyle: (val: string) => void;
}

export function SessionDefaultsCard({ coachingStyle, setCoachingStyle }: SessionDefaultsCardProps) {
  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          Default Session Demeanor
        </CardTitle>
        <CardDescription className="text-zinc-400">Sets the AI&apos;s tone for live sessions when no persona is selected.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ── Info callout ─────────────────────────────────────── */}
        <div className="flex items-start gap-3 rounded-lg border border-white/8 bg-white/3 px-4 py-3">
          <Info className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
          <p className="text-xs text-white/40 leading-relaxed">
            This is the AI&apos;s demeanor during live practice sessions by default. If you pick a persona
            (<span className="text-white/60 font-medium">Examiner / Optimist / Companion</span>) on the practice page before starting, that choice overrides this for the session.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Demeanor</Label>
          <Select value={coachingStyle || undefined} onValueChange={(val) => val && setCoachingStyle(val)}>
            <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-purple-500/20 focus:border-purple-500">
              <SelectValue placeholder="Select Demeanor" />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10 text-white">
              <SelectItem value="encouraging" className="focus:bg-white/10 focus:text-white">Encouraging & Patient</SelectItem>
              <SelectItem value="balanced" className="focus:bg-white/10 focus:text-white">Balanced & Natural</SelectItem>
              <SelectItem value="analytical" className="focus:bg-white/10 focus:text-white">Analytical & Precise</SelectItem>
              <SelectItem value="strict" className="focus:bg-white/10 focus:text-white">Strict & Demanding</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-zinc-500">Used as the AI&apos;s tone whenever no persona is selected for a session.</p>
        </div>

      </CardContent>
    </Card>
  );
}
