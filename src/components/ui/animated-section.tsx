"use client";

import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  variant?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function AnimatedSection({ children, className }: AnimatedSectionProps) {
  return <div className={className}>{children}</div>;
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  delayStart?: number;
  className?: string;
  once?: boolean;
}

export function StaggerContainer({ children, className }: StaggerContainerProps) {
  return <div className={className}>{children}</div>;
}

interface StaggerItemProps {
  children: ReactNode;
  variant?: string;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return <div className={className}>{children}</div>;
}

interface AnimatedHeadingProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  delay?: number;
  className?: string;
}

export function AnimatedHeading({ children, as: Tag = "h2", className }: AnimatedHeadingProps) {
  return <Tag className={className}>{children}</Tag>;
}
