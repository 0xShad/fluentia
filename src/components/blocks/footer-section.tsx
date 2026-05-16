"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function FooterSection() {
  return (
    <section className="pt-32 pb-16 border-t border-white/5 relative px-6 overflow-hidden">
      {/* Bottom Glow — reduced from blur-[150px] */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-primary/8 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="container mx-auto flex flex-col items-center text-center max-w-6xl">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Get Started with <span className="uppercase">Fluentia</span>
        </h2>
        <p className="text-muted-foreground mb-10">Try it for Free</p>

        <Button className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 h-12 text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,243,141,0.2)] mb-24 transition-transform hover:scale-105 active:scale-95">
          Try Now <Play className="w-4 h-4 ml-2" fill="currentColor" />
        </Button>

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
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Features</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Pricing</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Download</a>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-white font-medium mb-1">Resources</p>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Blog</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Documentation</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Community</a>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-white font-medium mb-1">Company</p>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">About</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Careers</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Contact</a>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-white font-medium mb-1">Legal</p>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
