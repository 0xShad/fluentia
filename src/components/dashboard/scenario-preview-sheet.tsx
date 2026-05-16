"use client";

import { useRouter } from "next/navigation";
import { Dialog } from "@base-ui/react/dialog";
import { CategoryIcon } from "@/components/dashboard/scenario-card";
import type { Scenario, DifficultyLevel } from "@/types/scenario.types";
import { Bot, Clock, CheckCircle2, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScenarioPreviewSheetProps {
  scenario: Scenario | null;
  open: boolean;
  onClose: () => void;
}

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  EASY:   "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  MEDIUM: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  HARD:   "text-orange-400 bg-orange-400/10 border-orange-400/20",
  EXPERT: "text-red-400 bg-red-400/10 border-red-400/20",
};

export function ScenarioPreviewSheet({
  scenario,
  open,
  onClose,
}: ScenarioPreviewSheetProps) {
  const router = useRouter();

  const handleStart = () => {
    onClose();
    router.push(`/dashboard/practice/${scenario?.id}`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0" />

        {/* Centered popup */}
        <Dialog.Popup className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <div
            className={cn(
              "pointer-events-auto relative w-full max-w-4xl max-h-[90vh] flex flex-col",
              "bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl",
              "transition-all duration-200 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95"
            )}
          >

            {/* ── Scrollable body ──────────────────────────────────────────── */}
            {scenario && (
              <div className="overflow-y-auto flex-1 rounded-t-2xl [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                {/* Header section */}
                <div className="px-7 pt-7 pb-5 border-b border-white/8">
                  {/* Category + difficulty + close */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                        <CategoryIcon category={scenario.category} className="w-3.5 h-3.5 text-[#00F38D]" />
                      </div>
                      <span className="text-[11px] font-bold text-white/35 uppercase tracking-widest">
                        {scenario.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded border uppercase tracking-wider", DIFFICULTY_COLORS[scenario.difficulty])}>
                        {scenario.difficulty}
                      </span>
                      <Dialog.Close
                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        aria-label="Close preview"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Dialog.Close>
                    </div>
                  </div>

                  <Dialog.Title className="text-2xl font-extrabold text-white tracking-tight leading-snug mb-2">
                    {scenario.title}
                  </Dialog.Title>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-white/30" />
                    <span className="text-xs text-white/35">{scenario.duration}</span>
                  </div>
                </div>

                {/* Content body */}
                <div className="px-7 py-6 space-y-6">
                  {/* Description */}
                  <p className="text-sm text-white/60 leading-relaxed">
                    {scenario.description}
                  </p>

                  {/* AI Role */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-[#00F38D]/5 border border-[#00F38D]/15">
                    <Bot className="w-4 h-4 text-[#00F38D] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-[#00F38D] uppercase tracking-wider mb-1">
                        AI plays
                      </p>
                      <p className="text-sm font-semibold text-white">{scenario.aiRole}</p>
                    </div>
                  </div>

                  {/* Two-col layout for skills + what to expect */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Skills trained */}
                    <div>
                      <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-3">
                        Skills you&apos;ll train
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {scenario.trains.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/55 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* What to expect */}
                    <div>
                      <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-3">
                        What to expect
                      </p>
                      <ul className="space-y-2">
                        {scenario.whatToExpect.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00F38D] mt-0.5 shrink-0" />
                            <span className="text-xs text-white/50 leading-snug">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Sample dialogue */}
                  <div>
                    <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-3">
                      Sample dialogue
                    </p>
                    <div className="space-y-3 rounded-xl bg-white/[0.02] border border-white/8 p-4">
                      {scenario.sampleDialogue.map((line, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex flex-col gap-1",
                            line.speaker === "You" ? "items-end" : "items-start"
                          )}
                        >
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            line.speaker === "AI" ? "text-[#00F38D]" : "text-white/30"
                          )}>
                            {line.speaker === "AI" ? `AI · ${scenario.aiRole}` : "You"}
                          </span>
                          <div className={cn(
                            "max-w-[80%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed",
                            line.speaker === "AI"
                              ? "bg-white/5 border border-white/8 text-white/70 rounded-tl-sm"
                              : "bg-[#00F38D]/10 border border-[#00F38D]/15 text-[#00F38D]/90 rounded-tr-sm"
                          )}>
                            {line.text}
                          </div>
                        </div>
                      ))}
                      <p className="text-center text-[10px] text-white/20 pt-1">
                        — Sample only. Your actual session will vary. —
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Sticky footer ─────────────────────────────────────────────── */}
            <div className="shrink-0 flex items-center gap-3 px-7 py-5 border-t border-white/8 rounded-b-2xl bg-[#0d0d0d]">
              <Dialog.Close
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/55 font-semibold hover:bg-white/8 hover:text-white transition-all"
              >
                Back
              </Dialog.Close>
              <button
                id={`start-session-${scenario?.id}`}
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00F38D] text-black font-bold text-sm hover:bg-[#00f38d]/90 active:scale-[0.98] transition-all hover:shadow-[0_0_28px_rgba(0,243,141,0.3)]"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Session
              </button>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
