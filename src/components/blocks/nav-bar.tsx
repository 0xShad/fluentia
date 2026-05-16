"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function NavBar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold tracking-tight text-white uppercase">fluentia</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {["Features", "Testimonials", "Pricing", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link href="/authentication/login" className="hidden md:block text-sm font-medium text-white hover:text-primary transition-colors">
            Log In
          </Link>
          <Link
            href="/authentication/register"
            className="inline-flex items-center justify-center rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 h-9 text-xs uppercase tracking-wider transition-colors"
          >
            Try Now <Play className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
