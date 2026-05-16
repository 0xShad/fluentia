"use client";

import { cn } from "@/lib/utils";
import type { ScenarioCategoryMeta, ScenarioCategory } from "@/types/scenario.types";
import { CategoryIcon } from "@/components/dashboard/scenario-card";

interface ScenarioCategoryTileProps {
  category: ScenarioCategoryMeta;
  scenarioCount: number;
  isActive: boolean;
  onClick: (name: ScenarioCategory | "All") => void;
}

export function ScenarioCategoryTile({
  category,
  scenarioCount,
  isActive,
  onClick,
}: ScenarioCategoryTileProps) {
  return (
    <button
      id={`category-${category.name.toLowerCase().replace(/\s+/g, "-")}`}
      onClick={() => onClick(isActive ? "All" : category.name)}
      className={cn(
        // Base
        "group relative flex flex-col items-start text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden w-full",
        // Inactive
        !isActive && "bg-[#111] border-white/10 hover:border-white/20 hover:bg-white/[0.03]",
        // Active
        isActive && "bg-[#00F38D]/5 border-[#00F38D]/30 shadow-[0_0_24px_rgba(0,243,141,0.06)]"
      )}
      aria-pressed={isActive}
    >
      {/* Subtle glow on active */}
      {isActive && (
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00F38D]/10 blur-2xl rounded-full pointer-events-none" />
      )}

      {/* Icon */}
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center border mb-4 transition-colors",
          isActive
            ? "bg-[#00F38D]/15 border-[#00F38D]/30"
            : "bg-white/5 border-white/10 group-hover:bg-white/8"
        )}
      >
        <CategoryIcon
          category={category.name}
          className={cn("w-4 h-4", isActive ? "text-[#00F38D]" : "text-white/40 group-hover:text-white/60")}
        />
      </div>

      {/* Label + count */}
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className={cn(
            "text-sm font-bold leading-tight",
            isActive ? "text-white" : "text-white/70 group-hover:text-white"
          )}
        >
          {category.label}
        </span>
        <span
          className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-sm",
            isActive
              ? "bg-[#00F38D]/20 text-[#00F38D]"
              : "bg-white/8 text-white/35"
          )}
        >
          {scenarioCount}
        </span>
      </div>

      {/* Key skill */}
      <p
        className={cn(
          "text-[11px] leading-snug",
          isActive ? "text-[#00F38D]/70" : "text-white/30"
        )}
      >
        {category.keySkill}
      </p>
    </button>
  );
}
