import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AppearanceCardProps {
  themeMode: string | null;
  setThemeMode: (val: string) => void;
  interfaceDensity: string | null;
  setInterfaceDensity: (val: string) => void;
}

export function AppearanceCard({
  themeMode,
  setThemeMode,
  interfaceDensity,
  setInterfaceDensity
}: AppearanceCardProps) {
  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription className="text-zinc-400">Customize how the Fluentia interface looks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#050505] p-4">
          <div className="space-y-0.5">
            <Label className="text-sm">Dark Theme Fixed</Label>
            <p className="text-[10px] text-zinc-500">Force system to use absolute Dark Mode.</p>
          </div>
          <Switch 
            checked={themeMode === "dark"} 
            onCheckedChange={(c) => setThemeMode(c ? "dark" : "light")} 
            className="data-[state=checked]:bg-[#00F38D]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Interface Density</Label>
          <Select value={interfaceDensity || undefined} onValueChange={setInterfaceDensity}>
            <SelectTrigger className="bg-[#050505] border-white/10 text-white focus:ring-[#00F38D]/20 focus:border-[#00F38D]">
              <SelectValue placeholder="Select Density" />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/10 text-white">
              <SelectItem value="compact" className="focus:bg-white/10 focus:text-white">Compact (High Information)</SelectItem>
              <SelectItem value="comfortable" className="focus:bg-white/10 focus:text-white">Comfortable (Default spacing)</SelectItem>
              <SelectItem value="spacious" className="focus:bg-white/10 focus:text-white">Spacious (Relaxed padding)</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </CardContent>
    </Card>
  );
}
