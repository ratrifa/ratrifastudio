"use client";

import { useRef } from "react";
import { motion } from "motion/react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  // Persist across Activity hide/show cycles (component stays mounted).
  // First mount → animate in. Activity re-show → skip animation, appear instantly.
  const hasAnimated = useRef(false);
  const shouldAnimate = !hasAnimated.current;
  hasAnimated.current = true;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  );
}
