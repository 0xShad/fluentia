"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const DIRECTION_VARIANTS: Record<string, Variants> = {
  fadeUp:    { hidden: { opacity: 0, y: 24 },  visible: { opacity: 1, y: 0 } },
  fadeDown:  { hidden: { opacity: 0, y: -24 }, visible: { opacity: 1, y: 0 } },
  fadeLeft:  { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } },
  fadeRight: { hidden: { opacity: 0, x: 20 },  visible: { opacity: 1, x: 0 } },
  fade:      { hidden: { opacity: 0 },          visible: { opacity: 1 } },
};

interface AnimatedSectionProps {
  children: ReactNode;
  variant?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function AnimatedSection({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.55,
  once = true,
  className,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px 0px" });
  const v = DIRECTION_VARIANTS[variant] ?? DIRECTION_VARIANTS.fadeUp;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={v}
      transition={{ duration, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger Container ─────────────────────────────────────────────────────────

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  delayStart?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  delayStart = 0,
  className,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: delayStart },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger Item ──────────────────────────────────────────────────────────────

interface StaggerItemProps {
  children: ReactNode;
  variant?: string;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Animated Heading ──────────────────────────────────────────────────────────

interface AnimatedHeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  delay?: number;
  className?: string;
}

const MotionTags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
};

export function AnimatedHeading({
  children,
  as: Tag = "h2",
  delay = 0,
  className,
}: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px 0px" });
  const MotionTag = MotionTags[Tag];

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
