"use client";

import { motion } from "motion/react";

/**
 * Wraps route content so it fades + slides up into view once data is ready
 * (mounted fresh by `app/template.tsx` on every navigation/load).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
