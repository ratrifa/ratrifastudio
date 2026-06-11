"use client";

import { motion, useReducedMotion } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Detik. Stagger list: Math.min(index * 0.06, 0.3) */
  delay?: number;
  /** Jarak slide-up awal dalam px */
  y?: number;
}

/**
 * Scroll-reveal standar design system: fade + slide-up sekali saat masuk
 * viewport. Otomatis jadi statis kalau user prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
