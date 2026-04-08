"use client";

import { useState, useEffect } from "react";
import { ScenarioCard } from "@/components/dashboard/scenario-card";
import { PracticeSkeleton } from "./components/practice-skeleton";
import { cn } from "@/lib/utils";

const filters = ["All Scenarios", "Business", "Social", "Technical", "Leadership", "Crisis"];

export default function ScenariosPage() {
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Scenarios");

  useEffect(() => {
    // Brief delay to show skeleton for UX polish
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <PracticeSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] relative pb-20">
      <main className="flex-1 px-8 py-10 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">
            Master your <span className="text-[#00F38D] italic pl-2">Dialogue.</span>
          </h1>
          <p className="text-white/60 max-w-2xl text-lg">
            Select a curated scenario to train your AI-powered communication skills. 
            Real-time feedback, high-stakes environments, infinite practice.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-5 py-2 rounded-md text-sm font-semibold transition-all",
                activeFilter === filter
                  ? "bg-[#00F38D] text-black shadow-[0_0_15px_rgba(0,243,141,0.2)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <ScenarioCard
            title="Quarterly Earnings Presentation Defense"
            description="Defend your department's growth strategy against skeptical stakeholders and aggressive financial analysts. Focus on tone, data confidence, and rebuttal precision."
            category="Business"
            duration="15-20 MIN"
            difficulty="EXPERT"
            tag="Cognitive Bias Focus"
            isFeatured
            className="md:col-span-2 md:row-span-2"
          />

          <ScenarioCard
            title="Salary Negotiation"
            description="Navigating a mid-year promotion talk with a focus on value-based persuasion techniques."
            category="Business"
            duration="5 MIN"
          />

          <ScenarioCard
            title="Dinner Party Etiquette"
            description="Gracefully exiting a controversial conversation while maintaining social harmony."
            category="Social"
            duration="5 MIN"
          />

          <ScenarioCard
            title="Post-Mortem Briefing"
            description="Explaining a major system outage to non-technical executive leadership without using jargon."
            category="Technical"
            duration="12 MIN"
          />

          <ScenarioCard
            title="Can't find your specific scenario?"
            description=""
            category="Business"
            duration=""
            isNewRequest
          />

          <ScenarioCard
            title="Media Damage Control"
            description="Responding to a leaked internal document during a live broadcast interview simulation."
            category="Crisis"
            duration="25 MIN"
          />

          <ScenarioCard
            title="Delivering Difficult News"
            description="Conducting an empathetic but firm performance review for a long-term employee."
            category="Leadership"
            duration="10 MIN"
          />
        </div>
      </main>
    </div>
  );
}
