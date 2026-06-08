import { BootScreen } from "@/components/boot-screen";

/**
 * Suspense fallback shown while the page's Server Component awaits data.
 *
 * Deliberately NOT `LoadingScreen` for the homepage: that component is owned
 * by `SplashGate`, which mounts its own instance once data resolves and gates
 * the reveal behind a fixed-duration timer. Reusing `LoadingScreen` here would
 * mount a second instance on the swap and restart its animation mid-sequence.
 * `BootScreen` is a distinct "powering on" beat — the handoff into the full
 * terminal sequence reads as a continuation, not a repeat.
 */
export default function Loading() {
  return <BootScreen />;
}
