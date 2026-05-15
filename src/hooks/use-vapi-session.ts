import { useState, useEffect, useCallback } from "react";
import { getVapiClient } from "@/lib/voice/vapi-client";
import { buildScenarioPrompt } from "@/lib/prompts/vapi-prompts";
import type { Scenario } from "@/types/scenario.types";

export type SessionStatus = "idle" | "connecting" | "active" | "ended" | "error";

export interface TranscriptLine {
  id: string;
  speaker: "AI" | "User";
  text: string;      // what's rendered (committed + live partial for AI)
  committed: string; // finalized segments only — used to append the next segment
  isFinal: boolean;
}

export function useVapiSession() {
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const vapi = getVapiClient();

    const onCallStart = () => {
      setStatus("active");
      setError(null);
    };

    const onCallEnd = () => {
      setStatus("ended");
      setIsSpeaking(false);
      setVolumeLevel(0);
    };

    const onVolumeLevel = (volume: number) => setVolumeLevel(volume);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onMessage = (message: any) => {
      if (message.type !== "transcript") return;

      // Skip user partials — only commit when the user finishes speaking.
      // AI partials are kept so the response streams in real-time.
      if (message.role !== "assistant" && message.transcriptType !== "final") return;

      const speaker: "AI" | "User" = message.role === "assistant" ? "AI" : "User";
      const newText = (message.transcript || "").trim();
      if (!newText) return;

      const isFinal = message.transcriptType === "final";

      setTranscript((prev) => {
        const lastLine = prev.length > 0 ? prev[prev.length - 1] : null;
        const isSameBubble = lastLine !== null && lastLine.speaker === speaker;

        if (isSameBubble) {
          const prevCommitted = lastLine.committed;
          let newCommitted = prevCommitted;
          let displayText: string;

          if (isFinal) {
            // Append this completed segment to committed text.
            newCommitted = prevCommitted ? prevCommitted + " " + newText : newText;
            displayText = newCommitted;
          } else {
            // AI partial: show committed text + streaming partial without advancing
            // the committed pointer. Overwrites the partial from last tick so the
            // bubble grows smoothly if partials are cumulative (Deepgram default).
            displayText = prevCommitted ? prevCommitted + " " + newText : newText;
          }

          const updated = [...prev];
          updated[updated.length - 1] = { ...lastLine, text: displayText, committed: newCommitted };
          return updated;
        }

        // Speaker changed — start a new bubble.
        // committed is set to newText only for finals; partials start uncommitted.
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
      setStatus("error");
      setError(e.message || "An unexpected error occurred");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("volume-level", onVolumeLevel);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.removeAllListeners("call-start");
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

      await vapi.start({
        name: scenario.title,
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en",
          // Wait 500ms of silence after the last word before finalizing the user's turn.
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
    startCall,
    endCall,
    toggleMute,
    sendTextMessage,
  };
}
