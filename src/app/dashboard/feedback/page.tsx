"use client";

import { useRouter } from "next/navigation";
import { Brain, ArrowRight } from "lucide-react";

export default function FeedbackPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center">
        <Brain className="w-8 h-8 text-[#8b5cf6]" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">AI Feedback</h2>
        <p className="text-sm text-white/40 max-w-sm">
          Select a session from your history to view detailed AI coaching feedback and performance analysis.
        </p>
      </div>
      <button
        onClick={() => router.push("/dashboard/sessions")}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F38D] text-black text-sm font-bold hover:bg-[#00F38D]/90 transition-all"
      >
        View Session History
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
