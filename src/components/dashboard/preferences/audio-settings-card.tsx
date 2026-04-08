import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Headphones, Mic } from "lucide-react";

interface AudioSettingsCardProps {
  micInput: string | null;
  setMicInput: (val: string) => void;
  speakerOutput: string | null;
  setSpeakerOutput: (val: string) => void;
  micSensitivity: readonly number[];
  setMicSensitivity: (val: readonly number[]) => void;
  voicePlayback: boolean;
  setVoicePlayback: (val: boolean) => void;
  testAudio: () => void;
}

export function AudioSettingsCard({
  micInput,
  setMicInput,
  speakerOutput,
  setSpeakerOutput,
  micSensitivity,
  setMicSensitivity,
  voicePlayback,
  setVoicePlayback,
  testAudio
}: AudioSettingsCardProps) {
  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Headphones className="w-5 h-5 text-[#00F38D]" />
          Audio Settings
        </CardTitle>
        <CardDescription className="text-zinc-400">Configure your microphone and speaker for AI voice practice sessions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Microphone Input</Label>
            <Select value={micInput || undefined} onValueChange={setMicInput}>
              <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-[#00F38D]/20 focus:border-[#00F38D]">
                <SelectValue placeholder="Select Input" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                <SelectItem value="default" className="focus:bg-white/10 focus:text-white">Default - System Mic</SelectItem>
                <SelectItem value="macbook" className="focus:bg-white/10 focus:text-white">MacBook Pro Microphone</SelectItem>
                <SelectItem value="external" className="focus:bg-white/10 focus:text-white">External USB Condenser (Mock)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Speaker Output</Label>
            <Select value={speakerOutput || undefined} onValueChange={setSpeakerOutput}>
              <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-[#00F38D]/20 focus:border-[#00F38D]">
                <SelectValue placeholder="Select Output" />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 text-white">
                <SelectItem value="default" className="focus:bg-white/10 focus:text-white">Default - System Output</SelectItem>
                <SelectItem value="macbook" className="focus:bg-white/10 focus:text-white">MacBook Pro Speakers</SelectItem>
                <SelectItem value="external" className="focus:bg-white/10 focus:text-white">External Interface (Mock)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-zinc-400">Input Sensitivity</Label>
            <span className="text-xs text-[#00F38D]">{micSensitivity[0]}%</span>
          </div>
          <Slider 
            value={micSensitivity as number[]}
            onValueChange={setMicSensitivity}
            max={100} 
            step={1} 
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#050505] p-4">
          <div className="space-y-0.5">
            <Label className="text-sm">Enable Voice Playback</Label>
            <p className="text-[10px] text-zinc-500">Hear your own voice slightly delayed for enunciation monitoring.</p>
          </div>
          <Switch 
            checked={voicePlayback} 
            onCheckedChange={setVoicePlayback} 
            className="data-[state=checked]:bg-[#00F38D]"
          />
        </div>

        <Button onClick={testAudio} variant="outline" className="w-full border-white/10 bg-[#0A0A0A] hover:bg-white/5 text-white justify-start gap-3">
          <Mic className="w-4 h-4 text-zinc-400" />
          Test Audio Setup
        </Button>
      </CardContent>
    </Card>
  );
}
