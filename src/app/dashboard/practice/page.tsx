"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, LayoutGrid } from "lucide-react";
import { ScenarioCard } from "@/components/dashboard/scenario-card";
import { ScenarioCategoryTile } from "@/components/dashboard/scenario-category-tile";
import { ScenarioPreviewSheet } from "@/components/dashboard/scenario-preview-sheet";
import { PracticeSkeleton } from "./components/practice-skeleton";
import { scenarios } from "@/data/scenarios";
import { SCENARIO_CATEGORIES } from "@/types/scenario.types";
import type { ScenarioCategory, Scenario } from "@/types/scenario.types";
import { cn } from "@/lib/utils";

export default function ScenariosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ScenarioCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewScenario, setPreviewScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const countByCategory = useMemo(() => {
    const map: Partial<Record<ScenarioCategory, number>> = {};
    for (const s of scenarios) {
      map[s.category] = (map[s.category] ?? 0) + 1;
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return scenarios.filter((s) => {
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.aiRole.toLowerCase().includes(q) ||
        s.trains.some((t) => t.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredScenario = filtered.find((s) => s.isFeatured);
  const restScenarios = filtered.filter((s) => !s.isFeatured);
  const activeCategoryMeta =
    activeCategory === "All"
      ? null
      : SCENARIO_CATEGORIES.find((c) => c.name === activeCategory);

  const handleStart = (scenario: Scenario) => {
    router.push(`/dashboard/practice/${scenario.id}`);
  };

  if (loading) return <PracticeSkeleton />;

  return (
    <>
      <div className="min-h-screen bg-[#0A0A0A] pb-20">
        <main className="px-6 md:px-8 py-10 max-w-5xl mx-auto w-full">

          {/* ── Header ────────────────────────────────────────────────────── */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
              Practice with{" "}
              <span className="text-[#00F38D] italic">AI.</span>
            </h1>
            <p className="text-white/55 max-w-xl text-base leading-relaxed">
              Pick a category, choose a scenario, and start a live voice session.
              The AI takes on a real role and responds to everything you say.
            </p>
          </div>

          {/* ── Category Browser ──────────────────────────────────────────── */}
          <section
            aria-label="Scenario categories"
            className="mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5 text-white/30" />
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                  Browse by Category
                </span>
              </div>
              {activeCategory !== "All" && (
                <button
                  onClick={() => setActiveCategory("All")}
                  className="text-xs text-white/35 hover:text-[#00F38D] transition-colors font-medium"
                >
                  View all
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {SCENARIO_CATEGORIES.map((cat) => (
                <ScenarioCategoryTile
                  key={cat.name}
                  category={cat}
                  scenarioCount={countByCategory[cat.name] ?? 0}
                  isActive={activeCategory === cat.name}
                  onClick={setActiveCategory}
                />
              ))}
            </div>
          </section>

          {/* ── Divider ───────────────────────────────────────────────────── */}
          <div className="border-t border-white/[0.06] mb-8" />

          {/* ── Search + count ────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-6 animate-in fade-in duration-700">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
              <input
                id="scenario-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios or skills…"
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-8 py-2 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#00F38D]/40 focus:bg-white/[0.06] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <span className="text-xs text-white/25 font-mono tabular-nums shrink-0 ml-4">
              {filtered.length} session{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Active category description */}
          {activeCategoryMeta && !searchQuery && (
            <div className={cn("mb-6 px-4 py-3 rounded-lg bg-[#00F38D]/5 border border-[#00F38D]/15 animate-in fade-in duration-300")}>
              <p className="text-sm text-white/60 leading-relaxed">
                <span className="font-semibold text-[#00F38D]">{activeCategoryMeta.label}: </span>
                {activeCategoryMeta.description}
              </p>
            </div>
          )}

          {/* ── Empty State ───────────────────────────────────────────────── */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No sessions found</h3>
              <p className="text-white/35 text-sm max-w-xs">
                Try searching for a skill like &quot;confidence&quot; or select a different category.
              </p>
            </div>
          )}

          {/* ── Scenario Grid ─────────────────────────────────────────────── */}
          {filtered.length > 0 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <p className="text-[11px] font-bold text-white/25 uppercase tracking-widest">
                {activeCategory === "All" ? "All Sessions" : activeCategoryMeta?.label}
              </p>

              {/* Featured — full width */}
              {featuredScenario && (
                <ScenarioCard
                  key={featuredScenario.id}
                  title={featuredScenario.title}
                  description={featuredScenario.description}
                  aiRole={featuredScenario.aiRole}
                  trains={featuredScenario.trains}
                  category={featuredScenario.category}
                  duration={featuredScenario.duration}
                  difficulty={featuredScenario.difficulty}
                  isFeatured
                  onPreview={() => setPreviewScenario(featuredScenario)}
                  onStart={() => handleStart(featuredScenario)}
                />
              )}

              {/* Rest — 2 col grid */}
              {restScenarios.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {restScenarios.map((scenario) => (
                    <ScenarioCard
                      key={scenario.id}
                      title={scenario.title}
                      description={scenario.description}
                      aiRole={scenario.aiRole}
                      trains={scenario.trains}
                      category={scenario.category}
                      duration={scenario.duration}
                      difficulty={scenario.difficulty}
                      onPreview={() => setPreviewScenario(scenario)}
                      onStart={() => handleStart(scenario)}
                    />
                  ))}

                  {activeCategory === "All" && (
                    <ScenarioCard
                      title="Need a custom scenario?"
                      description=""
                      category="Everyday"
                      duration=""
                      isNewRequest
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Preview Sheet (portal — outside main layout) ───────────────────── */}
      <ScenarioPreviewSheet
        scenario={previewScenario}
        open={previewScenario !== null}
        onClose={() => setPreviewScenario(null)}
      />
    </>
  );
}
