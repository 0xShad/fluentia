"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PreferencesSkeleton } from "./components/preferences-skeleton";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/client";

import { CoachingBehaviorCard } from "@/components/dashboard/preferences/coaching-behavior-card";

export default function SystemPreferencesPage() {
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // AI Coaching Behavior State
  const [skillLevel, setSkillLevel] = useState<string | null>("intermediate");
  const [speakingGoals, setSpeakingGoals] = useState<string[]>([]);
  const [feedbackDetail, setFeedbackDetail] = useState<string | null>("standard");
  const [coachingTone, setCoachingTone] = useState<string | null>("encouraging");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setSkillLevel(data.skill_level ?? "intermediate");
          setSpeakingGoals(data.speaking_goals ?? []);
          setCoachingTone(data.coaching_tone ?? "encouraging");
          setFeedbackDetail(data.feedback_detail ?? "standard");
        }
      }
      setPageLoading(false);
    };
    load();
  }, []);

  const handleSavePreferences = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Not signed in");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("user_preferences").upsert({
      user_id: user.id,
      skill_level: skillLevel ?? "intermediate",
      speaking_goals: speakingGoals,
      coaching_tone: coachingTone ?? "encouraging",
      feedback_detail: feedbackDetail ?? "standard",
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    setLoading(false);

    if (error) {
      toast.error("Failed to save preferences", {
        description: "Something went wrong. Please try again.",
        style: { background: "#050505", border: "1px solid rgba(255,0,0,0.2)", color: "white" }
      });
      return;
    }

    toast.success("Preferences Saved", {
      description: "Your AI coaching settings will apply to all future sessions.",
      style: { background: "#050505", border: "1px solid rgba(0,243,141,0.2)", color: "white" }
    });
  };

  const handleReset = async () => {
    const confirmReset = window.confirm("Are you sure you want to reset all preferences to default?");
    if (!confirmReset) return;

    setSkillLevel("intermediate");
    setSpeakingGoals([]);
    setFeedbackDetail("standard");
    setCoachingTone("encouraging");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("user_preferences").upsert({
        user_id: user.id,
        skill_level: "intermediate",
        speaking_goals: [],
        coaching_tone: "encouraging",
        feedback_detail: "standard",
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }

    toast.info("Preferences Restored", {
      description: "All settings have been restored to factory defaults."
    });
  };

  if (pageLoading) {
    return <PreferencesSkeleton />;
  }

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 animate-in fade-in duration-500 w-full max-w-2xl mx-auto pb-24">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">System Preferences</h2>
        <p className="text-muted-foreground text-sm">Customize how your AI coach scores and frames your post-session feedback.</p>
      </div>

      <CoachingBehaviorCard
        skillLevel={skillLevel}
        setSkillLevel={setSkillLevel}
        speakingGoals={speakingGoals}
        setSpeakingGoals={setSpeakingGoals}
        feedbackDetail={feedbackDetail}
        setFeedbackDetail={setFeedbackDetail}
        coachingTone={coachingTone}
        setCoachingTone={setCoachingTone}
      />

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 right-0 left-0 md:left-(--sidebar-width) p-4 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-end gap-4 z-50">
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
