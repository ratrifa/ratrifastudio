"use client";

import { useEffect, useState } from "react";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep first render deterministic to avoid server/client icon mismatch.
  if (!mounted) {
    return <button type="button" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hover:bg-purple-500 hover:text-white rounded-full transition-colors")} aria-label="Toggle theme" disabled />;
  }

  return <AnimatedThemeToggler className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hover:bg-purple-500 hover:text-white rounded-full transition-colors")} aria-label="Toggle theme" />;
}
