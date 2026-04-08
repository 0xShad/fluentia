import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageRegionCardProps {
  interfaceLanguage: string | null;
  setInterfaceLanguage: (val: string) => void;
  aiVoiceLanguage: string | null;
  setAiVoiceLanguage: (val: string) => void;
  timezone: string | null;
  setTimezone: (val: string) => void;
}

export function LanguageRegionCard({
  interfaceLanguage,
  setInterfaceLanguage,
  aiVoiceLanguage,
  setAiVoiceLanguage,
  timezone,
  setTimezone
}: LanguageRegionCardProps) {
  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle>Language & Region</CardTitle>
        <CardDescription className="text-zinc-400">Set interface locales and AI translation capabilities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Interface Language</Label>
            <Select value={interfaceLanguage || undefined} onValueChange={setInterfaceLanguage}>
              <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-[#00F38D]/20 focus:border-[#00F38D]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                <SelectItem value="en-US" className="focus:bg-white/10 focus:text-white">English (US)</SelectItem>
                <SelectItem value="en-UK" className="focus:bg-white/10 focus:text-white">English (UK)</SelectItem>
                <SelectItem value="es" className="focus:bg-white/10 focus:text-white">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">AI Voice Model</Label>
            <Select value={aiVoiceLanguage || undefined} onValueChange={setAiVoiceLanguage}>
              <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-[#00F38D]/20 focus:border-[#00F38D]">
                <SelectValue placeholder="AI Voice" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                  <SelectItem value="en-US-Neural2-F" className="focus:bg-white/10 focus:text-white">US English (Female Neural)</SelectItem>
                  <SelectItem value="en-US-Neural2-M" className="focus:bg-white/10 focus:text-white">US English (Male Neural)</SelectItem>
                  <SelectItem value="en-GB-Neural2-C" className="focus:bg-white/10 focus:text-white">British English (Neural)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-xs text-zinc-400">Timezone</Label>
          <Select value={timezone || undefined} onValueChange={setTimezone}>
            <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-[#00F38D]/20 focus:border-[#00F38D]">
              <SelectValue placeholder="Select Timezone" />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10 text-white">
              <SelectItem value="auto" className="focus:bg-white/10 focus:text-white">Detect Automatically (System)</SelectItem>
              <SelectItem value="utc" className="focus:bg-white/10 focus:text-white">UTC Coordinated Universal Time</SelectItem>
              <SelectItem value="est" className="focus:bg-white/10 focus:text-white">Eastern Standard Time (EST)</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </CardContent>
    </Card>
  );
}
