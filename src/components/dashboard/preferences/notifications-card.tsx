import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationsCardProps {
  sessionReminders: boolean;
  setSessionReminders: (val: boolean) => void;
  weeklyReports: boolean;
  setWeeklyReports: (val: boolean) => void;
  realtimeAlerts: boolean;
  setRealtimeAlerts: (val: boolean) => void;
  emailNotifications: boolean;
  setEmailNotifications: (val: boolean) => void;
}

export function NotificationsCard({
  sessionReminders,
  setSessionReminders,
  weeklyReports,
  setWeeklyReports,
  realtimeAlerts,
  setRealtimeAlerts,
  emailNotifications,
  setEmailNotifications
}: NotificationsCardProps) {
  return (
    <Card className="bg-[#111] border-white/10 text-white shadow-xl shadow-black/20">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription className="text-zinc-400">Control when Fluentia sends reminders and updates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#050505] p-3">
          <Label className="text-sm font-medium">Session Reminders</Label>
          <Switch 
            checked={sessionReminders} 
            onCheckedChange={setSessionReminders} 
            className="data-[state=checked]:bg-[#00F38D]"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#050505] p-3">
          <Label className="text-sm font-medium">Weekly Progress Reports</Label>
          <Switch 
            checked={weeklyReports} 
            onCheckedChange={setWeeklyReports} 
            className="data-[state=checked]:bg-[#00F38D]"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#050505] p-3">
          <Label className="text-sm font-medium">Real-time Feedback Alerts</Label>
          <Switch 
            checked={realtimeAlerts} 
            onCheckedChange={setRealtimeAlerts} 
            className="data-[state=checked]:bg-[#00F38D]"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-[#050505] p-3">
          <Label className="text-sm font-medium">Email Notifications</Label>
          <Switch 
            checked={emailNotifications} 
            onCheckedChange={setEmailNotifications} 
            className="data-[state=checked]:bg-[#00F38D]"
          />
        </div>

      </CardContent>
    </Card>
  );
}
