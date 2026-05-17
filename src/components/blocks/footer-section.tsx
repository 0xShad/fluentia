"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";

export function FooterSection() {
  return (
    <section className="pt-32 pb-16 border-t border-white/5 relative px-6 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/8 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto flex flex-col items-center text-center max-w-6xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Start Speaking with <span className="uppercase">Fluentia</span>
        </h2>
        <p className="text-muted-foreground mb-10">Free to get started. No credit card required.</p>

        <Link href="/authentication/register">
          <Button className="rounded-sm bg-primary hover:bg-primary/90 text-black font-bold px-6 h-10 text-[11px] uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,141,0.2)] hover:shadow-[0_0_30px_rgba(0,243,141,0.4)] mb-24 transition-all duration-200 group">
            Start Practicing <Play className="w-3.5 h-3.5 ml-2 transition-transform duration-200 group-hover:translate-x-0.5" fill="currentColor" />
          </Button>
        </Link>

        {/* Footer Links */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start pt-16 border-t border-white/10 text-left gap-12 md:gap-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="font-bold text-black text-[10px] tracking-tighter shrink-0 uppercase">Fl</span>
              </div>
              <span className="text-sm font-bold tracking-tight text-white uppercase">fluentia</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">© 2026 Fluentia.<br />All rights reserved.</p>
          </div>

          <div className="flex flex-wrap gap-16 text-sm">
            <div className="flex flex-col gap-4">
              <p className="text-white font-medium mb-1">Product</p>
              <a href="#features" className="text-muted-foreground hover:text-white transition-colors">Features</a>
              <a href="#faq" className="text-muted-foreground hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-white font-medium mb-1">Legal</p>
              <Link href="/terms" className="text-muted-foreground hover:text-white transition-colors">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
