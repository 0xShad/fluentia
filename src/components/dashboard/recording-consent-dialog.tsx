"use client";

import { useState } from "react";
import { Shield, Mic, FileText, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface RecordingConsentDialogProps {
  open: boolean;
  onConfirm: (recordingEnabled: boolean, remember: boolean) => void;
  onCancel: () => void;
}

export function RecordingConsentDialog({
  open,
  onConfirm,
  onCancel,
}: RecordingConsentDialogProps) {
  const [dontRecord, setDontRecord] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleBegin = () => {
    onConfirm(!dontRecord, remember);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <DialogContent className="bg-[#111111] border border-white/10 text-white max-w-md p-0 gap-0 rounded-2xl overflow-hidden">

        {/* Header accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#00F38D]/60 via-[#00F38D] to-[#00F38D]/60" />

        <div className="p-6">
          <DialogHeader className="mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#00F38D]/10 border border-[#00F38D]/20 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-[#00F38D]" />
              </div>
              <DialogTitle className="text-base font-bold text-white leading-snug">
                Before we begin
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-white/50 leading-relaxed">
              This session uses AI to coach you in real time.
            </DialogDescription>
          </DialogHeader>

          {/* Data collected items */}
          <div className="space-y-2.5 mb-5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/8">
              <Mic className="w-3.5 h-3.5 text-white/40 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white/70">Voice transcript</p>
                <p className="text-[11px] text-white/35 leading-relaxed mt-0.5">
                  Your speech is transcribed in real time by Deepgram and sent to our AI to generate feedback. Always required.
                </p>
              </div>
            </div>
            <div className={cn(
              "flex items-start gap-3 p-3 rounded-xl border transition-all duration-200",
              dontRecord
                ? "bg-white/[0.02] border-white/5 opacity-50"
                : "bg-white/[0.03] border-white/8"
            )}>
              <FileText className="w-3.5 h-3.5 text-white/40 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white/70">Audio recording</p>
                <p className="text-[11px] text-white/35 leading-relaxed mt-0.5">
                  An mp3 of your session is saved securely to your account so you can replay it later.
                  {dontRecord && <span className="text-amber-400/70"> Disabled for this session.</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Don't record toggle */}
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/8 cursor-pointer hover:bg-white/[0.04] transition-colors mb-2.5 select-none">
            <div
              className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                dontRecord
                  ? "bg-amber-400/20 border-amber-400/60"
                  : "border-white/20 bg-transparent"
              )}
            >
              {dontRecord && (
                <svg className="w-2.5 h-2.5 text-amber-400" fill="none" viewBox="0 0 10 10">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={dontRecord}
              onChange={(e) => setDontRecord(e.target.checked)}
            />
            <div>
              <p className="text-xs font-semibold text-white/70">Don&apos;t record this session</p>
              <p className="text-[11px] text-white/35">Transcript and feedback still work — only the audio file is skipped.</p>
            </div>
          </label>

          {/* Remember choice */}
          <label className="flex items-center gap-3 px-1 py-2 cursor-pointer hover:opacity-80 transition-opacity mb-5 select-none">
            <div
              className={cn(
                "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                remember
                  ? "bg-[#00F38D]/20 border-[#00F38D]/60"
                  : "border-white/20 bg-transparent"
              )}
            >
              {remember && (
                <svg className="w-2.5 h-2.5 text-[#00F38D]" fill="none" viewBox="0 0 10 10">
                  <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <p className="text-xs text-white/40">Remember my choice for future sessions</p>
          </label>

          {/* Actions */}
          <div className="flex gap-2.5">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white/50 font-semibold hover:bg-white/8 hover:text-white/70 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleBegin}
              className="flex-1 py-2.5 rounded-xl bg-[#00F38D] text-black text-sm font-bold hover:bg-[#00F38D]/90 active:scale-[0.98] transition-all"
            >
              Begin Session
            </button>
          </div>

          {/* Privacy link */}
          <div className="mt-4 text-center">
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-white/25 hover:text-white/50 transition-colors"
            >
              How we handle your data
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
