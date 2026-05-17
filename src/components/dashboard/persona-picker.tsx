"use client";

import { LayoutGroup, motion } from "framer-motion";
import { Coffee, HeartHandshake, ShieldAlert } from "lucide-react";
import type { PersonaId } from "@/types/scenario.types";
import { PERSONAS_LIST } from "@/data/personas";
import { cn } from "@/lib/utils";

const PERSONA_ICONS: Record<PersonaId, React.FC<{ className?: string }>> = {
  strict: ShieldAlert,
  supportive: HeartHandshake,
  casual: Coffee,
};

interface PersonaPickerProps {
  value: PersonaId;
  onChange: (id: PersonaId) => void;
  disabled?: boolean;
}

export function PersonaPicker({ value, onChange, disabled }: PersonaPickerProps) {
  return (
    <div className={cn("w-full max-w-sm", disabled && "opacity-50 pointer-events-none")}>
      <p className="text-xs text-white/30 font-semibold uppercase tracking-widest mb-3 text-center">
        Choose your AI&apos;s style
      </p>
      <LayoutGroup>
        <div className="flex gap-2.5">
          {PERSONAS_LIST.map((persona, index) => {
            const Icon = PERSONA_ICONS[persona.id];
            const isSelected = value === persona.id;
            return (
              <motion.button
                key={persona.id}
                type="button"
                onClick={() => onChange(persona.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.06 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-2 rounded-xl border py-4 px-3 text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00F38D]/50 overflow-hidden transition-colors duration-150",
                  isSelected
                    ? "bg-[#00F38D]/8 border-[#00F38D]/40"
                    : "bg-white/3 border-white/10 hover:border-white/20 hover:bg-white/5"
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="persona-check"
                    className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#00F38D] flex items-center justify-center"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3 5.5L6.5 2" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                )}
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isSelected ? "bg-[#00F38D]/15" : "bg-white/8"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isSelected ? "text-[#00F38D]" : "text-white/40")} />
                </div>
                <span className={cn("text-[11px] font-bold leading-tight", isSelected ? "text-white" : "text-white/50")}>
                  {persona.name}
                </span>
                <span className={cn("text-[10px] leading-snug", isSelected ? "text-[#00F38D]/70" : "text-white/30")}>
                  {persona.tagline}
                </span>
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
