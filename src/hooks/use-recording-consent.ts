import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/client";

export type RecordingConsent = "always" | "never" | "ask";

interface UseRecordingConsentReturn {
  consent: RecordingConsent | null; // null = still loading
  saveConsent: (value: RecordingConsent) => Promise<void>;
}

export function useRecordingConsent(): UseRecordingConsentReturn {
  const [consent, setConsent] = useState<RecordingConsent | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setConsent("ask");
        return;
      }
      const { data } = await supabase
        .from("user_preferences")
        .select("recording_consent")
        .eq("user_id", user.id)
        .single();

      setConsent((data?.recording_consent as RecordingConsent) ?? "ask");
    };
    load();
  }, []);

  const saveConsent = useCallback(async (value: RecordingConsent) => {
    setConsent(value);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("user_preferences")
      .upsert({ user_id: user.id, recording_consent: value }, { onConflict: "user_id" });
  }, []);

  return { consent, saveConsent };
}
