import { useState, useEffect, useCallback } from "react";
import { getVapiClient } from "@/lib/voice/vapi-client";
import { buildScenarioPrompt } from "@/lib/prompts/vapi-prompts";
import type { Scenario } from "@/types/scenario.types";

export type SessionStatus = "idle" | "connecting" | "active" | "ended" | "error";

export interface TranscriptLine {
  id: string;
  speaker: "AI" | "User";
  text: string;
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

    // Event listeners
    const onCallStart = () => {
      setStatus("active");
      setError(null);
    };

    const onCallEnd = () => {
      setStatus("ended");
      setIsSpeaking(false);
      setVolumeLevel(0);
    };

    const onVolumeLevel = (volume: number) => {
      setVolumeLevel(volume);
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onMessage = (message: any) => {
      if (message.type === "transcript") {
        setTranscript((prev) => {
          const speaker = message.role === "assistant" ? "AI" : "User";
          const newText = message.transcript || "";

          if (prev.length === 0) {
            return [{
              id: Date.now().toString(),
              speaker,
              text: newText,
              isFinal: true
            }];
          }

          const lastIndex = prev.length - 1;
          const lastLine = prev[lastIndex];

          // Foolproof merge: If it's the same speaker's turn, always overwrite their current bubble.
          // This handles growing text ("Hello" -> "Hello there") seamlessly without relying on Vapi flags.
          if (lastLine.speaker === speaker) {
            const newPrev = [...prev];
            newPrev[lastIndex] = {
              ...lastLine,
              text: newText,
            };
            return newPrev;
          }

          // Otherwise, it's a new turn, so make a new bubble
          return [
            ...prev,
            {
              id: Date.now().toString() + Math.random(),
              speaker,
              text: newText,
              isFinal: true
            }
          ];
        });
      }
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
      // Cleanup listeners
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
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [{ role: "system", content: systemPrompt }],
        },
        voice: {
          provider: "11labs",
          voiceId: "burt", // Using a guaranteed valid default 11labs voice
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
      message: {
        role: "user",
        content: text
      }
    });
    
    // Optimistically add to transcript
    setTranscript(prev => [...prev, {
      id: Date.now().toString(),
      speaker: "User",
      text: text,
      isFinal: true
    }]);
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
    sendTextMessage
  };
}
