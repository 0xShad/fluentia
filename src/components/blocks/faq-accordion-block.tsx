"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What scenarios can I practice?",
    answer:
      "Fluentia covers a wide range of professional and academic situations. You can practice job interviews, performance reviews, salary negotiations, academic defenses, or even casual everyday chats. We also allow you to create custom scenarios tailored to your specific needs.",
  },
  {
    question: "How does the real-time feedback work?",
    answer:
      "As you speak, our AI analyzes your audio stream instantly. If you speak too quickly, use too many filler words (like 'um' or 'uh'), or hesitate for long periods, unobtrusive visual hints appear on your dashboard to help you adjust your pacing.",
  },
  {
    question: "Is my voice data saved or shared?",
    answer:
      "Your privacy is our priority. Voice streams are processed securely and your practice sessions are kept entirely private. You have full control to review or delete your session transcripts and analytics at any time.",
  },
  {
    question: "Can Fluentia help non-native English speakers?",
    answer:
      "Absolutely. Our judgment-free AI provides a safe environment to practice and build confidence. The analytics dashboard helps you track metrics like clarity and pacing over time, making it an excellent tool for improving your conversational English.",
  },
  {
    question: "Do I need any special equipment?",
    answer:
      "No specialized equipment is required! As long as you have a modern web browser and a working microphone (built-in or external), you can start practicing immediately.",
  },
  {
    question: "Is there a free tier available?",
    answer:
      "Yes, we offer a free tier that gives you access to basic practice scenarios and essential communication analytics so you can start building your confidence right away.",
  },
];

export function FAQAccordionBlock() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full bg-[#050505] border-t border-white/5 px-6 py-24 relative overflow-hidden">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-4xl relative z-10">
        {/* Header — fires when scrolled into view */}
        <motion.div
          initial={{ opacity: 0, y: -20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-12 text-center md:mb-16"
        >
          <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <HelpCircle className="h-3 w-3" />
            <span className="uppercase tracking-widest">FAQ</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Find answers to common questions about our AI communication coach.
          </p>
        </motion.div>

        {/* FAQ Accordion — staggered scroll reveal */}
        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.05,
              },
            },
          }}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
                }}
              >
                <Card className="overflow-hidden border border-white/10 bg-[#080808] transition-all hover:border-primary/30">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-4 text-left md:p-6 group"
                  >
                    <span className="pr-4 text-base font-semibold text-white md:text-lg group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/5 p-4 md:p-6">
                          <motion.p
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.2, delay: 0.05 }}
                            className="text-sm text-zinc-400 md:text-base leading-relaxed"
                          >
                            {faq.answer}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA — scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mt-12 text-center md:mt-16"
        >
          <Card className="border border-white/10 bg-[#080808] p-6 md:p-8 relative overflow-hidden">
            {/* Subtle glow inside card */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
              </motion.div>
              <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">
                Still have questions?
              </h3>
              <p className="mb-6 text-sm text-zinc-400 md:text-base">
                Our team is here to help you dial in your communication practice.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 uppercase tracking-wider text-xs">
                    Contact Support
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
