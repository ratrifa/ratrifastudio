/**
 * Lightweight Suspense fallback shown only for the brief moment before the
 * homepage's data resolves and `SplashGate` takes over with the full terminal
 * sequence. Deliberately a different beat ("booting up" vs. "running a build")
 * so the handoff reads as a continuation rather than the same animation
 * restarting from scratch.
 */
const TERMINAL_FONT =
  'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace';

export function BootScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="pointer-events-none absolute size-80 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative w-[min(30rem,90vw)] overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/5">
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </div>
          <span
            className="flex-1 truncate text-center text-xs text-muted-foreground"
            style={{ fontFamily: TERMINAL_FONT }}
          >
            ratrifa — boot
          </span>
          <span className="size-3" aria-hidden />
        </div>

        <div
          className="px-4 py-3.5 text-[13px] leading-relaxed"
          style={{ fontFamily: TERMINAL_FONT }}
        >
          <p className="flex items-center gap-2 text-muted-foreground">
            <span className="text-[#28c840]">[ OK ]</span>
            Initializing system
            <span className="inline-flex items-center gap-1" aria-hidden>
              <span className="size-1 rounded-full bg-muted-foreground [animation:boot-dot_1.4s_ease-in-out_infinite]" />
              <span className="size-1 rounded-full bg-muted-foreground [animation:boot-dot_1.4s_ease-in-out_0.2s_infinite]" />
              <span className="size-1 rounded-full bg-muted-foreground [animation:boot-dot_1.4s_ease-in-out_0.4s_infinite]" />
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes boot-dot {
          0%, 60%, 100% { opacity: 0.25; }
          30% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
