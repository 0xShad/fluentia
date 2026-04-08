"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PreferencesSkeleton } from "./components/preferences-skeleton";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

// Import modular preferences cards
import { AudioSettingsCard } from "@/components/dashboard/preferences/audio-settings-card";
import { AppearanceCard } from "@/components/dashboard/preferences/appearance-card";
import { LanguageRegionCard } from "@/components/dashboard/preferences/language-region-card";
import { CoachingBehaviorCard } from "@/components/dashboard/preferences/coaching-behavior-card";
import { NotificationsCard } from "@/components/dashboard/preferences/notifications-card";

export default function SystemPreferencesPage() {
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Audio Settings State (Includes null safety for Base UI strict constraints)
  const [micInput, setMicInput] = useState<string | null>("default");
  const [speakerOutput, setSpeakerOutput] = useState<string | null>("default");
  const [micSensitivity, setMicSensitivity] = useState<readonly number[]>([75]);
  const [voicePlayback, setVoicePlayback] = useState(true);

  // Appearance State
  const [themeMode, setThemeMode] = useState<string | null>("dark");
  const [interfaceDensity, setInterfaceDensity] = useState<string | null>("comfortable");

  // Language & Region State
  const [interfaceLanguage, setInterfaceLanguage] = useState<string | null>("en-US");
  const [aiVoiceLanguage, setAiVoiceLanguage] = useState<string | null>("en-US-Neural2-F");
  const [timezone, setTimezone] = useState<string | null>("auto");

  // Notifications State
  const [sessionReminders, setSessionReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [realtimeAlerts, setRealtimeAlerts] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // AI Coaching Behavior State
  const [realtimeHints, setRealtimeHints] = useState(true);
  const [feedbackDetail, setFeedbackDetail] = useState<string | null>("standard");
  const [coachingTone, setCoachingTone] = useState<string | null>("encouraging");
  const [correctionSensitivity, setCorrectionSensitivity] = useState<readonly number[]>([60]);

  const handleSavePreferences = () => {
    setLoading(true);
    // Mock save logic pushing all localized state vars down
    setTimeout(() => {
      setLoading(false);
      toast.success("System Preferences Saved", {
        description: "Your Fluentia dashboard settings have been applied.",
        style: { background: "#050505", border: "1px solid rgba(0,243,141,0.2)", color: "white" }
      });
    }, 800);
  };

  const handleReset = () => {
    const confirmReset = window.confirm("Are you sure you want to reset all preferences to default?");
    if (!confirmReset) return;
    
    // Reset defaults directly
    setMicSensitivity([75] as const);
    setCorrectionSensitivity([60] as const);
    setMicInput("default");
    setSpeakerOutput("default");
    setVoicePlayback(true);
    setThemeMode("dark");
    setInterfaceDensity("comfortable");
    setInterfaceLanguage("en-US");
    setAiVoiceLanguage("en-US-Neural2-F");
    setTimezone("auto");
    setSessionReminders(true);
    setWeeklyReports(true);
    setRealtimeAlerts(false);
    setEmailNotifications(true);
    setRealtimeHints(true);
    setFeedbackDetail("standard");
    setCoachingTone("encouraging");

    toast.info("Preferences Restored", {
      description: "All settings have been restored to factory defaults."
    });
  };

  const testAudio = () => {
    toast.info("Testing audio endpoint...", {
      description: "You should hear a brief tone through your selected output device."
    });
  };

  useEffect(() => {
    // Brief delay to show skeleton for UX polish
    const timer = setTimeout(() => setPageLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <PreferencesSkeleton />;
  }

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 animate-in fade-in duration-500 w-full max-w-5xl mx-auto pb-24">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">System Preferences</h2>
        <p className="text-muted-foreground text-sm">Customize how Fluentia behaves, including audio setup, interface preferences, and AI coaching behavior.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Column 1 */}
        <div className="space-y-8">
          <AudioSettingsCard 
            micInput={micInput}
            setMicInput={setMicInput}
            speakerOutput={speakerOutput}
            setSpeakerOutput={setSpeakerOutput}
            micSensitivity={micSensitivity}
            setMicSensitivity={setMicSensitivity}
            voicePlayback={voicePlayback}
            setVoicePlayback={setVoicePlayback}
            testAudio={testAudio}
          />

          <AppearanceCard 
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            interfaceDensity={interfaceDensity}
            setInterfaceDensity={setInterfaceDensity}
          />

          <LanguageRegionCard 
             interfaceLanguage={interfaceLanguage}
             setInterfaceLanguage={setInterfaceLanguage}
             aiVoiceLanguage={aiVoiceLanguage}
             setAiVoiceLanguage={setAiVoiceLanguage}
             timezone={timezone}
             setTimezone={setTimezone}
          />
        </div>

        {/* Column 2 */}
        <div className="space-y-8">
          <CoachingBehaviorCard 
             realtimeHints={realtimeHints}
             setRealtimeHints={setRealtimeHints}
             feedbackDetail={feedbackDetail}
             setFeedbackDetail={setFeedbackDetail}
             coachingTone={coachingTone}
             setCoachingTone={setCoachingTone}
             correctionSensitivity={correctionSensitivity}
             setCorrectionSensitivity={setCorrectionSensitivity}
          />

          <NotificationsCard 
             sessionReminders={sessionReminders}
             setSessionReminders={setSessionReminders}
             weeklyReports={weeklyReports}
             setWeeklyReports={setWeeklyReports}
             realtimeAlerts={realtimeAlerts}
             setRealtimeAlerts={setRealtimeAlerts}
             emailNotifications={emailNotifications}
             setEmailNotifications={setEmailNotifications}
          />
        </div>
      </div>

      {/* Floating Action Bar equivalent block */}
      <div className="fixed bottom-0 right-0 left-0 md:left-[var(--sidebar-width)] p-4 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-end gap-4 z-50">
        <Button 
          onClick={handleReset} 
          variant="ghost" 
          className="text-zinc-400 hover:text-white hover:bg-white/5 gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </Button>
        <Button 
          onClick={handleSavePreferences} 
          disabled={loading}
          className="bg-[#00F38D] text-black hover:bg-[#00F38D]/90 font-bold px-8 shadow-[0_0_15px_rgba(0,243,141,0.2)] gap-2"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>

    </div>
  );
}
