export interface UserPreferences {
  // Learning profile (affects AI session behavior & difficulty)
  skill_level: "beginner" | "intermediate" | "advanced" | "native";
  coaching_style: "encouraging" | "balanced" | "analytical" | "strict";
  speaking_goals: string[];

  // Session behavior
  coaching_tone: "encouraging" | "balanced" | "direct" | "strict";
  feedback_detail: "minimal" | "standard" | "detailed";
  correction_sensitivity: number; // 0-100
  realtime_hints: boolean;
  preferred_voice: string; // voice id from VOICE_OPTIONS

  // Notifications
  session_reminders: boolean;
  weekly_reports: boolean;
  realtime_alerts: boolean;
  email_notifications: boolean;

  // Privacy
  recording_consent: "always" | "never" | "ask";
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  skill_level: "intermediate",
  coaching_style: "balanced",
  speaking_goals: [],
  coaching_tone: "encouraging",
  feedback_detail: "standard",
  correction_sensitivity: 60,
  realtime_hints: true,
  preferred_voice: "burt",
  session_reminders: true,
  weekly_reports: true,
  realtime_alerts: false,
  email_notifications: true,
  recording_consent: "ask",
};
