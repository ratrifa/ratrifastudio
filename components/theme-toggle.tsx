"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep first render deterministic to avoid server/client icon mismatch.
  if (!mounted) {
    return (
      <Button type="button" variant="ghost" size="icon" aria-label="Toggle theme" disabled>
        <Moon size={18} />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button type="button" variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
