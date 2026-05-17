"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const faqs = [
  {
    question: "What scenarios can I practice?",
    answer:
      "Fluentia has five categories: Interview, Business, Social, Public Speaking, and Everyday. Inside each category you'll find specific scenarios like job interviews, salary negotiations, client pitches, presentations, and casual conversations. You can also build a custom scenario for any situation you're preparing for.",
  },
  {
    question: "How does a practice session work?",
    answer:
      "Pick a scenario from the library and hit start. You'll have a live voice conversation with the AI, which plays the other person in the scenario. When the session ends, your full transcript and session metrics are saved to your dashboard automatically — ready for you to review at your own pace.",
  },
  {
    question: "Is my voice data saved or shared?",
    answer:
      "Your sessions are private to your account. Voice is processed to generate your transcript and is not shared with third parties. You can delete any session and its transcript from your dashboard at any time.",
  },
  {
    question: "Can Fluentia help non-native English speakers?",
    answer:
      "Yes. Fluentia is a good fit for anyone who wants more speaking practice in English. The AI keeps the conversation going at a natural pace, and the transcript lets you review vocabulary and sentence structure after the fact.",
  },
  {
    question: "Do I need any special equipment?",
    answer:
      "Just a browser and a microphone. A built-in laptop mic works fine. A headset gives you cleaner audio and a better transcript, but it's not required to get started.",
  },
];

export function FAQAccordionBlock() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full bg-[#050505] border-t border-white/5 px-6 py-24 relative overflow-hidden scroll-mt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-36 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-4xl relative z-10">
        <div className="mb-12 text-center md:mb-16">
          <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <HelpCircle className="h-3 w-3" />
            <span className="uppercase tracking-widest">FAQ</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Quick answers about how Fluentia works.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index}>
                <Card className="overflow-hidden border border-white/10 bg-[#080808] transition-all hover:border-primary/30">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-4 text-left md:p-6 group"
                  >
                    <span className="pr-4 text-base font-semibold text-white md:text-lg group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground group-hover:text-primary transition-[colors,transform] duration-200 shrink-0",
                        isOpen && "rotate-180"
                      )}
                      style={{ transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/5 p-4 md:p-6">
                          <p className="text-sm text-zinc-400 md:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center md:mt-16">
          <Card className="border border-white/10 bg-[#080808] p-6 md:p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent" />
            <div className="relative z-10">
              <MessageCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">
                Still have questions?
              </h3>
              <p className="mb-6 text-sm text-zinc-400 md:text-base">
                Reach out and we&apos;ll get back to you.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 uppercase tracking-wider text-xs active:scale-[0.97]">
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
