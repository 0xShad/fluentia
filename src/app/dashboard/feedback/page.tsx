"use client";

import { useState, useEffect } from "react";
import { MetricCard } from "./components/metric-card";
import { AISuggestionCard } from "./components/ai-suggestion-card";
import { FeedbackSkeleton } from "./components/feedback-skeleton";
import { TranscriptHighlights } from "./components/transcript-highlights";
import { FeedbackHeader } from "./components/feedback-header";
import { mockMetrics, mockSuggestions, mockTranscriptSegments } from "./data/mock-feedback";
import { Volume2, Clock, Shield, AlertTriangle, Hourglass, Activity } from "lucide-react";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Brief delay to show skeleton for UX polish
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <FeedbackSkeleton />;
  }

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 animate-in fade-in duration-500 w-full max-w-6xl mx-auto">
      <FeedbackHeader 
        sessionTitle="Q3 Project Pitch Practice" 
        sessionDate="Apr 8, 2026" 
      />

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Clarity"
          score={mockMetrics.clarity.score}
          icon={Volume2}
          description={mockMetrics.clarity.description}
          trend={mockMetrics.clarity.trend}
          trendValue={mockMetrics.clarity.trendValue}
        />
        <MetricCard
          title="Pacing"
          score={mockMetrics.pacing.score}
          icon={Clock}
          description={mockMetrics.pacing.description}
          trend={mockMetrics.pacing.trend}
          trendValue={mockMetrics.pacing.trendValue}
        />
        <MetricCard
          title="Confidence"
          score={mockMetrics.confidence.score}
          icon={Shield}
          description={mockMetrics.confidence.description}
          trend={mockMetrics.confidence.trend}
          trendValue={mockMetrics.confidence.trendValue}
        />
        <MetricCard
          title="Filler Words"
          score={mockMetrics.fillerWords.score}
          icon={AlertTriangle}
          description={mockMetrics.fillerWords.description}
          trend={mockMetrics.fillerWords.trend}
          trendValue={mockMetrics.fillerWords.trendValue}
        />
        <MetricCard
          title="Pause Timing"
          score={mockMetrics.pauseTiming.score}
          icon={Hourglass}
          description={mockMetrics.pauseTiming.description}
          trend={mockMetrics.pauseTiming.trend}
          trendValue={mockMetrics.pauseTiming.trendValue}
        />
        <MetricCard
          title="Tone Consistency"
          score={mockMetrics.toneConsistency.score}
          icon={Activity}
          description={mockMetrics.toneConsistency.description}
          trend={mockMetrics.toneConsistency.trend}
          trendValue={mockMetrics.toneConsistency.trendValue}
        />
      </div>

      {/* AI Suggestions & Transcript */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AISuggestionCard suggestions={mockSuggestions} />
        <TranscriptHighlights segments={mockTranscriptSegments} />
      </div>
    </div>
  );
}
