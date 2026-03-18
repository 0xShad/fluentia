"use client";

import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Preset animation variants
// ---------------------------------------------------------------------------
const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
  slideReveal: {
    hidden: { opacity: 0, y: 60, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
};

interface AnimatedSectionProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: keyof typeof variants;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

/**
 * AnimatedSection — wraps children with a scroll-triggered entrance animation.
 * Uses Framer Motion `whileInView` so it fires as the element enters the viewport.
 */
export function AnimatedSection({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.7,
  once = true,
  className,
  ...props
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98], // custom spring-like ease
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Staggered container — animates children one by one
// ---------------------------------------------------------------------------
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  delayStart?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.12,
  delayStart = 0,
  className,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayStart,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// StaggerItem — must be a direct child of StaggerContainer
// ---------------------------------------------------------------------------
interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function StaggerItem({
  children,
  variant = "fadeUp",
  className,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={variants[variant]}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// AnimatedHeading — gradient text reveal specifically for headings
// ---------------------------------------------------------------------------
interface AnimatedHeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  delay?: number;
  className?: string;
}

export function AnimatedHeading({
  children,
  as: Tag = "h2",
  delay = 0,
  className,
}: AnimatedHeadingProps) {
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
