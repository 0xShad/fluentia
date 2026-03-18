"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection, AnimatedHeading, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { motion } from "framer-motion";
import { Mic, BarChart, FileText, Bell, MessageSquare, LayoutDashboard } from "lucide-react";

const features = [
  { icon: <Mic />, title: "Voice AI Scenarios", desc: "Practice job interviews, academic discussions, or casual chats with an intelligent voice agent in a judgment-free zone." },
  { icon: <MessageSquare />, title: "Real-Time Coaching", desc: "Get live hints during conversations to adjust your pacing, reduce filler words, and sound instantly more confident." },
  { icon: <BarChart />, title: "Confidence Dashboard", desc: "Track your progress over time with detailed metrics on speech clarity, word usage, and overall fluency." },
  { icon: <FileText />, title: "Session Insights", desc: "Review complete transcripts and actionable insights after every practice scenario." },
  { icon: <Bell />, title: "Custom Scenarios", desc: "Create individualized roleplay scenes to practice exactly what you need for your upcoming meetings." },
  { icon: <LayoutDashboard />, title: "Historical Tracking", desc: "Keep a complete history of your conversations and watch your communication metrics improve week by week." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16">
          <AnimatedSection variant="fadeLeft" delay={0}>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">Everything You Need</p>
          </AnimatedSection>
          <AnimatedHeading as="h2" delay={0.1} className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            What You&apos;ll Unlock<br />with FLUENTIA
          </AnimatedHeading>
        </div>

        <StaggerContainer staggerDelay={0.1} delayStart={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ y: -6, borderColor: "rgba(0,243,141,0.5)" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-full"
              >
                <Card className="bg-[#080808] border-white/10 transition-all duration-300 group cursor-pointer overflow-hidden relative min-h-[220px] h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex justify-between items-start w-full">
                      <motion.div
                        className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/10 transition-colors"
                        whileHover={{ rotate: [0, -8, 8, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        {feature.icon}
                      </motion.div>
                      <div className="text-[10px] font-mono text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">0{i + 1}</div>
                    </div>
                    <CardTitle className="text-lg font-medium text-white group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-sm text-zinc-400 leading-relaxed">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
