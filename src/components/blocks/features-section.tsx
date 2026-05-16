"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection, AnimatedHeading, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";
import { Mic, BarChart, FileText, BookOpen, PenLine, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: <Mic />,
    title: "Scenario Library",
    desc: "Choose from Interview, Business, Social, Public Speaking, and Everyday scenarios. The AI plays the other role and responds naturally to what you say.",
  },
  {
    icon: <BookOpen />,
    title: "Transcript Review",
    desc: "Every session is transcribed automatically. Read back through the full conversation, spot hesitations or weak phrasing, and know exactly what to work on.",
  },
  {
    icon: <BarChart />,
    title: "Confidence Dashboard",
    desc: "Your session scores and communication metrics live in one place. Check in after each session to see how your numbers are trending over time.",
  },
  {
    icon: <FileText />,
    title: "Session Insights",
    desc: "Each session comes with a breakdown of your performance — what you said, how you paced yourself, and where there's room to improve.",
  },
  {
    icon: <PenLine />,
    title: "Custom Scenarios",
    desc: "Build your own roleplay for a specific situation — a salary negotiation, a client pitch, or a difficult conversation you've been putting off.",
  },
  {
    icon: <LayoutDashboard />,
    title: "Progress Tracking",
    desc: "Every session is saved. Come back anytime to compare sessions and watch your communication improve over time.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16">
          <AnimatedSection variant="fadeLeft" delay={0}>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-3">What You Get</p>
          </AnimatedSection>
          <AnimatedHeading as="h2" delay={0.1} className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Everything Inside<br />FLUENTIA
          </AnimatedHeading>
        </div>

        <StaggerContainer staggerDelay={0.1} delayStart={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <StaggerItem key={i}>
              <div className="h-full transition-transform duration-200 ease-out hover:-translate-y-1.5">
                <Card className="bg-[#080808] border-white/10 hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden relative min-h-55 h-full">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-transparent to-primary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="pb-4 relative z-10">
                    <div className="flex justify-between items-start w-full">
                      <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/10 transition-colors">
                        {feature.icon}
                      </div>
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
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
