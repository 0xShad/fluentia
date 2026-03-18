"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

export function NavBar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl"
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <span className="text-xl font-bold tracking-tight text-white uppercase">fluentia</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {["Features", "Pricing", "Blog", "Docs", "Company"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="hover:text-white transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
            >
              {item}
            </motion.a>
          ))}
        </div>

        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a href="#" className="hidden md:block text-sm font-medium text-white hover:text-primary transition-colors">Log In</a>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 h-9 text-xs uppercase tracking-wider">
              Try Now <Play className="w-3 h-3 ml-1" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
