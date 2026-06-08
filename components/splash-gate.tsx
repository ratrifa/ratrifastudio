"use client";

import { useEffect, useState } from "react";

import { LoadingScreen } from "@/components/loading-screen";

/**
 * Keeps the real page hidden until the terminal `LoadingScreen` has fully
 * played out — Next.js swaps the `loading.tsx` Suspense fallback the instant
 * data resolves, which can cut the animation off mid-sequence. The terminal
 * sequence in `loading-screen.tsx` finishes revealing its last line at ~8.25s,
 * so children only mount (and the overlay fades away) after that.
 */
const TERMINAL_ANIMATION_MS = 8500;
const FADE_MS = 400;

export function SplashGate({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(true);

  useEffect(() => {
    const revealTimer = setTimeout(() => setRevealed(true), TERMINAL_ANIMATION_MS);
    return () => clearTimeout(revealTimer);
  }, []);

  useEffect(() => {
    if (!revealed) return;
    const unmountTimer = setTimeout(() => setOverlayMounted(false), FADE_MS);
    return () => clearTimeout(unmountTimer);
  }, [revealed]);

  return (
    <>
      {revealed && children}
      {overlayMounted && (
        <div
          className="fixed inset-0 z-50 transition-opacity ease-out"
          style={{ opacity: revealed ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
        >
          <LoadingScreen />
        </div>
      )}
    </>
  );
}
