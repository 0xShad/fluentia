import type { Suggestion } from "../components/ai-suggestion-card";
import type { TranscriptSegment } from "../components/transcript-highlights";

export const mockMetrics = {
  clarity: { score: 82, trend: "up" as const, trendValue: "+5%", description: "Your message structure is clear and well-organized" },
  pacing: { score: 68, trend: "down" as const, trendValue: "-3%", description: "Speaking pace was too fast in several sections" },
  confidence: { score: 75, trend: "up" as const, trendValue: "+8%", description: "Strong vocal presence with good energy" },
  fillerWords: { score: 45, trend: "down" as const, trendValue: "-12%", description: "Used 'um' and 'like' frequently - needs focus" },
  pauseTiming: { score: 70, trend: "neutral" as const, trendValue: "0%", description: "Good use of pauses between main points" },
  toneConsistency: { score: 88, trend: "up" as const, trendValue: "+6%", description: "Professional and engaging tone throughout" },
};

export const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    type: "improvement",
    message: "You used 'um' 14 times during this session. Try replacing filler words with intentional pauses.",
    context: "Um, I think that we should, um, consider the alternative approach",
  },
  {
    id: "2",
    type: "improvement",
    message: "Your pacing was too fast in the opening section. Slow down to emphasize key points.",
    context: "Between 0:45 and 1:30, you spoke at 180 WPM - target is 140-150 WPM",
  },
  {
    id: "3",
    type: "strength",
    message: "Excellent job using vocal variety to maintain engagement. Your tone shifts were well-timed.",
  },
  {
    id: "4",
    type: "tip",
    message: "Try shorter sentences for complex ideas. This improves clarity and gives natural breathing room.",
  },
  {
    id: "5",
    type: "improvement",
    message: "Long pause detected at 2:15 (4.2 seconds). Consider transitioning smoothly or using the pause deliberately.",
  },
  {
    id: "6",
    type: "strength",
    message: "Your conclusion was powerful and memorable. Strong closing statement with confident delivery.",
  },
];

export const mockTranscriptSegments: TranscriptSegment[] = [
  {
    id: "1",
    timestamp: "00:12",
    text: "Um, I think we should consider the new approach to this problem.",
    highlights: [{ type: "filler", start: 0, end: 3 }],
  },
  {
    id: "2",
    timestamp: "00:45",
    text: "The key benefits are improved efficiency better collaboration and significant cost savings.",
    highlights: [{ type: "fast", start: 0, end: 77 }],
  },
  {
    id: "3",
    timestamp: "01:23",
    text: "Let me pause here for a moment to emphasize this critical point.",
    highlights: [{ type: "good", start: 0, end: 62 }],
  },
  {
    id: "4",
    timestamp: "02:15",
    text: "...",
    highlights: [{ type: "pause", start: 0, end: 3 }],
  },
  {
    id: "5",
    timestamp: "02:19",
    text: "So, like, what I'm trying to say is that we need to, um, focus on the user experience.",
    highlights: [
      { type: "filler", start: 0, end: 3 },
      { type: "filler", start: 29, end: 32 },
      { type: "filler", start: 44, end: 47 },
    ],
  },
  {
    id: "6",
    timestamp: "03:45",
    text: "In conclusion, this strategy will drive sustainable growth and position us for long-term success.",
    highlights: [{ type: "good", start: 0, end: 88 }],
  },
];
