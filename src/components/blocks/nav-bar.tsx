"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function NavBar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold tracking-tight text-white uppercase">fluentia</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Link href="/authentication/login" className="hidden md:block text-sm font-medium text-white hover:text-primary transition-colors">
            Log In
          </Link>
          <Link
            href="/authentication/register"
            className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-primary/70 text-primary hover:bg-primary hover:text-black font-bold px-4 h-8 text-[10px] uppercase tracking-widest transition-[colors,background-color,color] duration-150 active:scale-[0.97]"
          >
            Start Practicing <Play className="w-2.5 h-2.5" fill="currentColor" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
