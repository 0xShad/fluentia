export type ScenarioCategory =
  | "Interview"
  | "Business"
  | "Social"
  | "Public Speaking"
  | "Everyday";

export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD" | "EXPERT";

export interface SampleDialogueLine {
  speaker: "AI" | "You";
  text: string;
}

export interface Scenario {
  id: string;
  title: string;
  /** Short setup brief shown on the card */
  description: string;
  /** What skills this session trains */
  trains: string[];
  /** What role the AI voice agent takes in this session */
  aiRole: string;
  /** The AI's literal first utterance, spoken in-character before any LLM turn (used as Vapi firstMessage) */
  openingLine: string;
  /** Ordered, AI-facing instructions: what the AI should proactively raise/ask/push for during the session */
  agenda: string[];
  /** What the user should expect going into this session */
  whatToExpect: string[];
  /** A short sample exchange shown in the preview */
  sampleDialogue: SampleDialogueLine[];
  category: ScenarioCategory;
  duration: string;
  difficulty: DifficultyLevel;
  isFeatured?: boolean;
}

export interface ScenarioCategoryMeta {
  name: ScenarioCategory;
  label: string;
  description: string;
  keySkill: string;
}

export type PersonaId = "strict" | "supportive" | "casual";

export interface Persona {
  id: PersonaId;
  name: string;
  tagline: string;
  promptInstruction: string;
}

export function getDefaultPersonaId(category: ScenarioCategory): PersonaId {
  if (category === "Interview" || category === "Business") return "strict";
  if (category === "Social") return "casual";
  return "supportive";
}

export const SCENARIO_CATEGORIES: ScenarioCategoryMeta[] = [
  {
    name: "Interview",
    label: "Interview",
    description: "Practice job, scholarship, and academic interviews with an AI panelist who probes and challenges you in real time.",
    keySkill: "Confidence under pressure",
  },
  {
    name: "Business",
    label: "Business",
    description: "Negotiate, pitch, and navigate professional conversations with stakeholders and clients.",
    keySkill: "Persuasion & assertiveness",
  },
  {
    name: "Social",
    label: "Social",
    description: "Build natural conversation skills for everyday social situations — from small talk to difficult talks.",
    keySkill: "Social ease & active listening",
  },
  {
    name: "Public Speaking",
    label: "Public Speaking",
    description: "Practice presentations, speeches, and live Q&A with an AI audience that asks tough questions.",
    keySkill: "Structure & vocal confidence",
  },
  {
    name: "Everyday",
    label: "Everyday",
    description: "Handle the real-life conversations most people avoid — from complaints to boundary-setting.",
    keySkill: "Clarity & emotional regulation",
  },
];
