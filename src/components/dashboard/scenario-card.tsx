import { cn } from "@/lib/utils";
import { Play, Sparkles, Building2, Users, Code, ShieldAlert, ArrowRight } from "lucide-react";

export type ScenarioCategory = "Business" | "Social" | "Technical" | "Leadership" | "Crisis";

interface ScenarioCardProps {
  title: string;
  description: string;
  category: ScenarioCategory;
  duration: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  tag?: string;
  isFeatured?: boolean;
  isNewRequest?: boolean;
  className?: string;
}

const CategoryIcon = ({ category, className }: { category: ScenarioCategory, className?: string }) => {
  switch (category) {
    case "Business": return <Building2 className={className} />;
    case "Social": return <Users className={className} />;
    case "Technical": return <Code className={className} />;
    case "Leadership": return <Sparkles className={className} />;
    case "Crisis": return <ShieldAlert className={className} />;
    default: return <Building2 className={className} />;
  }
};

export function ScenarioCard({
  title,
  description,
  category,
  duration,
  difficulty,
  tag,
  isFeatured,
  isNewRequest,
  className
}: ScenarioCardProps) {
  if (isNewRequest) {
    return (
      <div className={cn("group flex flex-col justify-between p-6 rounded-xl bg-[#111] border gap-4 border-dashed border-white/20 hover:border-[#00F38D]/50 transition-all cursor-pointer relative overflow-hidden", className)}>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-[#00F38D] tracking-wider uppercase">Request New</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 leading-tight">Can't find your specific scenario?</h3>
          <p className="text-sm text-white/50 mb-6">
            Our AI can generate a custom training environment tailored to your upcoming meeting, date, or event.
          </p>
        </div>
        <div className="flex items-center text-sm font-semibold text-[#00F38D] group-hover:translate-x-1 transition-transform">
          Generate Custom Scenario <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    );
  }

  if (isFeatured) {
    return (
      <div className={cn("group flex flex-col justify-between p-8 rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/10 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden min-h-[360px]", className)}>
        {/* Faint Abstract Background Graphic overlay would go here */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F38D]/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#00F38D] text-black text-[10px] font-bold uppercase tracking-wider rounded-sm">Featured</span>
              <span className="px-2 py-1 bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-sm">High Stakes</span>
            </div>
            {difficulty && (
              <div className="text-right">
                <p className="text-[10px] text-white/50 uppercase font-semibold">Difficulty</p>
                <p className="text-sm font-bold text-white">{difficulty}</p>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          <h2 className="text-3xl font-bold text-white mb-3 max-w-[80%] leading-tight">{title}</h2>
          <p className="text-sm text-white/60 mb-8 max-w-[75%] leading-relaxed">{description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs text-white/50 font-medium">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00F38D]" />{duration}</div>
              {tag && <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#00F38D]" />{tag}</div>}
            </div>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:text-[#00F38D] transition-colors border border-white/10">
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Standard Card
  return (
    <div className={cn("group flex flex-col justify-between p-6 rounded-xl bg-[#111] border border-white/10 hover:border-white/20 transition-all cursor-pointer", className)}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
            <CategoryIcon category={category} className="w-4 h-4 text-[#00F38D]" />
          </div>
          <span className="text-[10px] font-bold text-white/50 tracking-wider uppercase">{category}</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2 leading-tight">{title}</h3>
        <p className="text-sm text-white/50 line-clamp-3 mb-6">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00F38D]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F38D]" /> {duration}
        </div>
        <div className="flex gap-1">
          <span className="w-4 h-[3px] rounded-full bg-[#00F38D]" />
          <span className="w-4 h-[3px] rounded-full bg-[#00F38D]" />
          <span className="w-4 h-[3px] rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}
