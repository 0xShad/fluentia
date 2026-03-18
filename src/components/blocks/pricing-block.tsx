"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { PricingSection } from "@/components/blocks/pricing";

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    info: 'For casual practice',
    price: { monthly: 0, yearly: 0 },
    features: [
      { text: '3 AI Voice Scenarios/mo', tooltip: 'Access standard practice sets' },
      { text: 'Basic Transcriptions' },
      { text: 'Overall Confidence Score', tooltip: 'A high-level view of your fluency' },
    ],
    btn: { text: 'Start for Free', href: '#' },
  },
  {
    id: 'pro',
    highlighted: true,
    name: 'Pro',
    info: 'For serious professionals',
    price: {
      monthly: 999,
      yearly: Math.round(999 * 12 * 0.8),
    },
    features: [
      { text: 'Unlimited Voice Scenarios' },
      { text: 'Real-Time Live Hints', tooltip: 'Instant visual cues for filler words and pacing' },
      { text: 'Custom Roleplays', tooltip: 'Build custom prompts for exact situations' },
      { text: 'Detailed Session Insights', tooltip: 'Word usage, clarity, and pacing over time' },
      { text: 'Priority Email Support' },
    ],
    btn: { text: 'Get Started', href: '#' },
  },
  {
    id: 'business',
    name: 'Business',
    info: 'For teams & organizations',
    price: {
      monthly: 2499,
      yearly: Math.round(2499 * 12 * 0.8),
    },
    features: [
      { text: 'Everything in Pro' },
      { text: 'Team Management Dashboard' },
      { text: 'SAML SSO Integration' },
      { text: 'Aggregate Organization Analytics', tooltip: 'Track your entire teams communication health' },
      { text: 'Dedicated Account Manager' },
    ],
    btn: { text: 'Contact Sales', href: '#' },
  },
];

export function PricingBlock() {
  return (
    <div id="pricing" className="py-24 relative px-6 border-t border-white/5 bg-[#050505] overflow-hidden">
      {/* Faint dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#00f38d18_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
      {/* Glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <AnimatedSection variant="fadeUp" delay={0} className="relative z-10 mx-auto max-w-6xl">
        <PricingSection
          heading="Plans that Scale with You"
          description="Whether you're practicing for a single interview or upgrading your entire team's communication skills, we have a plan for you."
          plans={pricingPlans}
        />
      </AnimatedSection>
    </div>
  );
}
