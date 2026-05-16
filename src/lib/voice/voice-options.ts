export type VoiceGender = "male" | "female" | "neutral";

export interface VoiceOption {
  id: string;
  label: string;
  gender: VoiceGender;
  provider: "11labs" | "openai";
  voiceId: string;
  description: string;
  accent: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  // ── ElevenLabs ────────────────────────────────────────────────────────────
  {
    id: "burt",
    label: "Burt",
    gender: "male",
    provider: "11labs",
    voiceId: "burt",
    description: "Deep & Authoritative",
    accent: "American",
  },
  {
    id: "marissa",
    label: "Marissa",
    gender: "female",
    provider: "11labs",
    voiceId: "marissa",
    description: "Warm & Friendly",
    accent: "American",
  },
  // ── OpenAI TTS ────────────────────────────────────────────────────────────
  {
    id: "onyx",
    label: "Onyx",
    gender: "male",
    provider: "openai",
    voiceId: "onyx",
    description: "Calm & Steady",
    accent: "American",
  },
  {
    id: "echo",
    label: "Echo",
    gender: "male",
    provider: "openai",
    voiceId: "echo",
    description: "Clear & Confident",
    accent: "American",
  },
  {
    id: "fable",
    label: "Fable",
    gender: "male",
    provider: "openai",
    voiceId: "fable",
    description: "Expressive & Natural",
    accent: "British",
  },
  {
    id: "nova",
    label: "Nova",
    gender: "female",
    provider: "openai",
    voiceId: "nova",
    description: "Bright & Professional",
    accent: "American",
  },
  {
    id: "shimmer",
    label: "Shimmer",
    gender: "female",
    provider: "openai",
    voiceId: "shimmer",
    description: "Soft & Encouraging",
    accent: "American",
  },
  {
    id: "alloy",
    label: "Alloy",
    gender: "neutral",
    provider: "openai",
    voiceId: "alloy",
    description: "Neutral & Balanced",
    accent: "American",
  },
];

export const DEFAULT_VOICE_ID = "burt";

export function getVoiceOption(id: string): VoiceOption {
  return VOICE_OPTIONS.find((v) => v.id === id) ?? VOICE_OPTIONS[0];
}
