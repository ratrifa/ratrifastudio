"use client";

import { useEffect, useLayoutEffect, useState } from "react";

import { LoadingScreen } from "@/components/loading-screen";

/**
 * Keeps the real page hidden until the terminal `LoadingScreen` has fully
 * played out — Next.js swaps the `loading.tsx` Suspense fallback the instant
 * data resolves, which can cut the animation off mid-sequence. The terminal
 * sequence in `loading-screen.tsx` finishes revealing its last line at ~8.25s,
 * so children only mount (and the overlay fades away) after that.
 *
 * The animation only plays once per browser session — `sessionStorage` tracks
 * whether it already ran, so navigating back to the homepage later in the same
 * tab skips straight to the content. `useLayoutEffect` resolves this before
 * paint so returning visitors don't see the overlay flash in.
 */
const TERMINAL_ANIMATION_MS = 8500;
const FADE_MS = 400;
const SESSION_KEY = "rf_splash_played";

export function SplashGate({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(true);

  useLayoutEffect(() => {
    let alreadyPlayed = false;
    try {
      alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — fall back to playing the animation.
    }

    if (alreadyPlayed) {
      setRevealed(true);
      setOverlayMounted(false);
      return;
    }

    const revealTimer = setTimeout(() => setRevealed(true), TERMINAL_ANIMATION_MS);
    return () => clearTimeout(revealTimer);
  }, []);

  useEffect(() => {
    if (!revealed || !overlayMounted) return;
    const unmountTimer = setTimeout(() => setOverlayMounted(false), FADE_MS);
    return () => clearTimeout(unmountTimer);
  }, [revealed, overlayMounted]);

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
