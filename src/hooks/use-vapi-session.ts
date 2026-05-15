import { useState, useEffect, useCallback, useRef } from "react";
import { getVapiClient } from "@/lib/voice/vapi-client";
import { buildScenarioPrompt } from "@/lib/prompts/vapi-prompts";
import type { Scenario } from "@/types/scenario.types";

export type SessionStatus = "idle" | "connecting" | "active" | "ended" | "error";

export interface TranscriptLine {
  id: string;
  speaker: "AI" | "User" | "System";
  text: string;      // what's rendered (committed + live partial for AI)
  committed: string; // finalized segments only — used to append the next segment
  isFinal: boolean;
}

const DEAD_AIR_THRESHOLD_MS = 3000;

export function useVapiSession() {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [callId, setCallId] = useState<string | null>(null);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSessionActive = useRef(false);

  useEffect(() => {
    const vapi = getVapiClient();

    const clearSilenceTimer = () => {
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
        silenceTimer.current = null;
      }
    };

    const armSilenceTimer = () => {
      clearSilenceTimer();
      silenceTimer.current = setTimeout(() => {
        if (!isSessionActive.current) return;
        setTranscript((prev) => [
          ...prev,
          {
            id: `${Date.now()}-silence`,
            speaker: "System" as const,
            text: "[ silence ]",
            committed: "[ silence ]",
            isFinal: true,
          },
        ]);
        // Re-arm so repeated dead air keeps showing markers
        armSilenceTimer();
      }, DEAD_AIR_THRESHOLD_MS);
    };

    const onCallStart = () => {
      isSessionActive.current = true;
      setStatus("active");
      setError(null);
    };

    const onCallEnd = () => {
      isSessionActive.current = false;
      clearSilenceTimer();
      setStatus("ended");
      setIsSpeaking(false);
      setVolumeLevel(0);
    };

    const onVolumeLevel = (volume: number) => setVolumeLevel(volume);

    const onSpeechStart = () => {
      clearSilenceTimer();
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
      // Only arm after AI finishes speaking — that's when we expect the user to respond
      if (isSessionActive.current) armSilenceTimer();
    };

    const onMessage = (message: any) => {
      if (message.type !== "transcript") return;

      // Skip user partials — only commit when the user finishes speaking.
      // AI partials are kept so the response streams in real-time.
      if (message.role !== "assistant" && message.transcriptType !== "final") return;

      const speaker: "AI" | "User" = message.role === "assistant" ? "AI" : "User";
      const newText = (message.transcript || "").trim();
      if (!newText) return;

      // User started talking — cancel the dead air timer
      if (speaker === "User") clearSilenceTimer();

      const isFinal = message.transcriptType === "final";

      setTranscript((prev) => {
        const lastLine = prev.length > 0 ? prev[prev.length - 1] : null;
        // Don't merge into a System (silence) line
        const isSameBubble = lastLine !== null && lastLine.speaker === speaker;

        if (isSameBubble) {
          const prevCommitted = lastLine.committed;
          let newCommitted = prevCommitted;
          let displayText: string;

          if (isFinal) {
            newCommitted = prevCommitted ? prevCommitted + " " + newText : newText;
            displayText = newCommitted;
          } else {
            // AI partial: show committed text + streaming partial without advancing
            // the committed pointer.
            displayText = prevCommitted ? prevCommitted + " " + newText : newText;
          }

          const updated = [...prev];
          updated[updated.length - 1] = { ...lastLine, text: displayText, committed: newCommitted };
          return updated;
        }

        return [
          ...prev,
          {
            id: Date.now().toString() + Math.random(),
            speaker,
            text: newText,
            committed: isFinal ? newText : "",
            isFinal: true,
          },
        ];
      });
    };

    const onError = (e: any) => {
      console.error("Vapi error:", e);
      clearSilenceTimer();
      setStatus("error");
      setError(e.message || "An unexpected error occurred");
    };

    const onCallStartSuccess = (event: { callId?: string }) => {
      if (event.callId) setCallId(event.callId);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-start-success", onCallStartSuccess);
    vapi.on("call-end", onCallEnd);
    vapi.on("volume-level", onVolumeLevel);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      clearSilenceTimer();
      vapi.removeAllListeners("call-start");
      vapi.removeAllListeners("call-start-success");
      vapi.removeAllListeners("call-end");
      vapi.removeAllListeners("volume-level");
      vapi.removeAllListeners("speech-start");
      vapi.removeAllListeners("speech-end");
      vapi.removeAllListeners("message");
      vapi.removeAllListeners("error");
    };
  }, []);

  const startCall = useCallback(async (scenario: Scenario) => {
    try {
      setStatus("connecting");
      setError(null);
      setTranscript([]);

      const systemPrompt = buildScenarioPrompt(scenario);
      const vapi = getVapiClient();

      setCallId(null);
      await vapi.start({
        name: scenario.title,
        artifactPlan: { recordingEnabled: true, recordingFormat: "mp3" },
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en",
          endpointing: 500,
        },
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [{ role: "system", content: systemPrompt }],
        },
        voice: {
          provider: "11labs",
          voiceId: "burt",
        },
        firstMessage: `Hello, I'm ready to begin the ${scenario.title} scenario.`,
      });
    } catch (e: any) {
      console.error("Failed to start call:", e);
      setStatus("error");
      setError(e.message || "Failed to start call. Ensure microphone permissions are granted.");
    }
  }, []);

  const endCall = useCallback(() => {
    getVapiClient().stop();
    setStatus("ended");
  }, []);

  const toggleMute = useCallback(() => {
    const vapi = getVapiClient();
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  }, [isMuted]);

  const sendTextMessage = useCallback((text: string) => {
    getVapiClient().send({
      type: "add-message",
      message: { role: "user", content: text },
    });
    setTranscript((prev) => [
      ...prev,
      { id: Date.now().toString(), speaker: "User", text, committed: text, isFinal: true },
    ]);
  }, []);

  return {
    status,
    isSpeaking,
    isMuted,
    volumeLevel,
    transcript,
    error,
    callId,
    startCall,
    endCall,
    toggleMute,
    sendTextMessage,
  };
}
