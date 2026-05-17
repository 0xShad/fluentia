import { cn } from "@/lib/utils";
import type { ScenarioCategory, DifficultyLevel } from "@/types/scenario.types";
import {
  Play,
  Sparkles,
  Building2,
  Users,
  Code,
  ArrowRight,
  Coffee,
  Briefcase,
  Bot,
  Mic,
  Eye,
} from "lucide-react";

export type { ScenarioCategory };

interface ScenarioCardProps {
  title: string;
  description: string;
  aiRole?: string;
  trains?: string[];
  category: ScenarioCategory;
  duration: string;
  difficulty?: DifficultyLevel;
  isFeatured?: boolean;
  isNewRequest?: boolean;
  className?: string;
  /** Called when user clicks "Preview" */
  onPreview?: () => void;
  /** Called when user clicks "Start Session" directly */
  onStart?: () => void;
}

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  EASY:   "text-emerald-400",
  MEDIUM: "text-yellow-400",
  HARD:   "text-orange-400",
  EXPERT: "text-red-400",
};

const DIFFICULTY_BG: Record<DifficultyLevel, string> = {
  EASY:   "bg-emerald-400/10 border-emerald-400/20",
  MEDIUM: "bg-yellow-400/10 border-yellow-400/20",
  HARD:   "bg-orange-400/10 border-orange-400/20",
  EXPERT: "bg-red-400/10 border-red-400/20",
};

export const CategoryIcon = ({
  category,
  className,
}: {
  category: ScenarioCategory;
  className?: string;
}) => {
  switch (category) {
    case "Interview":       return <Briefcase className={className} />;
    case "Business":        return <Building2 className={className} />;
    case "Social":          return <Users className={className} />;
    case "Public Speaking": return <Mic className={className} />;
    case "Everyday":        return <Coffee className={className} />;
    default:                return <Sparkles className={className} />;
  }
};

export function ScenarioCard({
  title,
  description,
  aiRole,
  trains,
  category,
  duration,
  difficulty,
  isFeatured,
  isNewRequest,
  className,
  onPreview,
  onStart,
}: ScenarioCardProps) {
  // ── Custom Session Request Card ──────────────────────────────────────────────
  if (isNewRequest) {
    return (
      <div
        className={cn(
          "group flex flex-col justify-between p-6 rounded-xl bg-[#0d0d0d] border border-dashed border-white/15 hover:border-[#00F38D]/40 transition-all cursor-pointer relative overflow-hidden",
          className
        )}
      >
        <div>
          <div className="w-9 h-9 rounded-lg bg-[#00F38D]/10 border border-[#00F38D]/20 flex items-center justify-center mb-5">
            <Code className="w-4 h-4 text-[#00F38D]" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 leading-snug">
            Need a custom scenario?
          </h3>
          <p className="text-sm text-white/40 leading-relaxed">
            Describe your situation and the AI builds a tailored session —
            upcoming interview, presentation, or difficult conversation.
          </p>
        </div>
        <div className="flex items-center mt-6 text-sm font-semibold text-[#00F38D] group-hover:translate-x-1 transition-transform">
          Generate Custom Session <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    );
  }

  // ── Featured Card ────────────────────────────────────────────────────────────
  if (isFeatured) {
    return (
      <div
        onClick={onPreview}
        className={cn(
          "group relative flex flex-col justify-between p-8 rounded-xl bg-gradient-to-br from-[#181818] to-[#0d0d0d] border border-white/10 hover:border-[#00F38D]/20 transition-[colors,border-color] overflow-hidden cursor-pointer active:scale-[0.99] transition-transform duration-150",
          className
        )}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#00F38D]/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Top badges */}
        <div className="relative z-10 flex items-start justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#00F38D] text-black text-[10px] font-bold uppercase tracking-wider rounded-sm">
              Featured
            </span>
            <span className="px-2.5 py-1 bg-white/8 text-white/70 text-[10px] font-bold uppercase tracking-wider rounded-sm border border-white/10">
              {category}
            </span>
          </div>
          {difficulty && (
            <span className={cn("px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border", DIFFICULTY_BG[difficulty], DIFFICULTY_COLORS[difficulty])}>
              {difficulty}
            </span>
          )}
        </div>

        {/* AI Role */}
        {aiRole && (
          <div className="relative z-10 flex items-center gap-2 mb-5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00F38D]/10 border border-[#00F38D]/20">
              <Bot className="w-3.5 h-3.5 text-[#00F38D]" />
              <span className="text-xs font-semibold text-[#00F38D]">AI plays: {aiRole}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight">
            {title}
          </h2>
          <p className="text-sm text-white/55 leading-relaxed mb-5 max-w-[85%]">
            {description}
          </p>

          {trains && trains.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {trains.map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/50 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/35 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F38D]" />
              {duration}
            </span>
            <div className="flex items-center gap-2">
              {onPreview && (
                <button
                  onClick={(e) => { e.stopPropagation(); onPreview(); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); onStart?.(); }}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#00F38D] text-black text-sm font-bold hover:bg-[#00f38d]/90 transition-[colors,background-color,shadow] hover:shadow-[0_0_24px_rgba(0,243,141,0.3)] active:scale-[0.97]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Standard Card ────────────────────────────────────────────────────────────
  return (
    <div
      onClick={onPreview}
      className={cn(
        "group flex flex-col justify-between p-6 rounded-xl bg-[#111] border border-white/10 hover:border-[#00F38D]/20 hover:bg-white/2 transition-[colors,border-color,background-color] cursor-pointer active:scale-[0.99] duration-150",
        className
      )}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
            <CategoryIcon category={category} className="w-4 h-4 text-[#00F38D]" />
          </div>
          {difficulty && (
            <span className={cn("text-[10px] font-bold tracking-wider uppercase", DIFFICULTY_COLORS[difficulty])}>
              {difficulty}
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-white mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-white/45 line-clamp-2 leading-relaxed mb-3">{description}</p>

        {/* AI Role */}
        {aiRole && (
          <div className="flex items-center gap-1.5 mb-3">
            <Bot className="w-3 h-3 text-[#00F38D] shrink-0" />
            <span className="text-[11px] text-[#00F38D] font-medium truncate">AI: {aiRole}</span>
          </div>
        )}

        {/* Skills */}
        {trains && trains.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {trains.map((skill) => (
              <span key={skill} className="px-2 py-0.5 rounded bg-white/5 border border-white/8 text-[10px] text-white/40 font-medium">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs text-white/30 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F38D]" />
          {duration}
        </span>
        <div className="flex items-center gap-2">
          {onPreview && (
            <button
              onClick={(e) => { e.stopPropagation(); onPreview(); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 font-semibold hover:bg-white/8 hover:text-white transition-all"
            >
              <Eye className="w-3 h-3" />
              Preview
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onStart?.(); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00F38D]/10 border border-[#00F38D]/20 text-xs text-[#00F38D] font-bold hover:bg-[#00F38D]/20 transition-colors active:scale-[0.97] duration-150"
          >
            <Play className="w-3 h-3 fill-current" />
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
