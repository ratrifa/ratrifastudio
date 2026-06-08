/**
 * Full-screen branded loader shown via `loading.tsx` Suspense boundaries
 * while server components await data from the Laravel API.
 *
 * Styled like a macOS Terminal window — fits the dev-portfolio brand better
 * than generic spinner/glow treatments. Font stack mirrors Terminal.app's
 * default (SF Mono / Menlo), not the site's Fira Code.
 */
const TERMINAL_FONT =
  'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Soft ambient glow behind the window */}
      <div className="pointer-events-none absolute size-80 rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative w-[min(30rem,90vw)] overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/5">
        {/* macOS-style title bar */}
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
            ratrifa — zsh — 80×24
          </span>
          <span className="size-3" aria-hidden />
        </div>

        {/* Terminal body */}
        <div
          className="px-4 py-3.5 text-[13px] leading-relaxed"
          style={{ fontFamily: TERMINAL_FONT }}
        >
          <p className="translate-y-1 opacity-0 text-muted-foreground/70 [animation:log-in_0.4s_ease-out_0.2s_forwards]">
            Last login: today on ttys000
          </p>

          {/* Each command line fades in with just its prompt, then types itself out */}
          <p className="translate-y-1 opacity-0 text-muted-foreground [animation:log-in_0.3s_ease-out_0.7s_forwards]">
            <span className="text-primary">ratrifa@ratrifa-studio</span> portfolio %{" "}
            <span className="relative inline-flex items-center">
              <span className="inline-block overflow-hidden whitespace-nowrap align-bottom [animation:type-cmd-20_1.4s_steps(20)_1s_both]">
                git pull origin main
              </span>
              <span className="ml-px inline-block h-[15px] w-[8px] translate-y-[3px] bg-foreground/80 [animation:caret_0.4s_steps(2)_infinite_1s,_caret-out_0.01s_linear_2.4s_forwards]" />
            </span>
          </p>
          <p className="translate-y-1 opacity-0 text-muted-foreground/80 [animation:log-in_0.4s_ease-out_2.6s_forwards]">
            Already up to date.
          </p>

          <p className="translate-y-1 opacity-0 text-muted-foreground [animation:log-in_0.3s_ease-out_3.1s_forwards]">
            <span className="text-primary">ratrifa@ratrifa-studio</span> portfolio %{" "}
            <span className="relative inline-flex items-center">
              <span className="inline-block overflow-hidden whitespace-nowrap align-bottom [animation:type-cmd-13_1s_steps(13)_3.4s_both]">
                npm run build
              </span>
              <span className="ml-px inline-block h-[15px] w-[8px] translate-y-[3px] bg-foreground/80 [animation:caret_0.4s_steps(2)_infinite_3.4s,_caret-out_0.01s_linear_4.4s_forwards]" />
            </span>
          </p>

          {/* npm-style braille spinner — stacked in the same grid cell as the first
              checklist line so its fade-out doesn't leave a blank gap behind */}
          <div className="grid">
            <p className="col-start-1 row-start-1 flex items-center gap-1.5 opacity-0 text-muted-foreground/80 [animation:log-in_0.3s_ease-out_4.4s_forwards,_fade-out_0.25s_ease-in_5.6s_forwards]">
              <span className="relative inline-block h-[1em] w-[1ch] overflow-hidden align-text-bottom">
                <span className="absolute left-0 top-0 whitespace-nowrap text-primary [animation:npm-spin_0.8s_steps(10)_infinite]">
                  ⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏
                </span>
              </span>
              Memproses data…
            </p>
            <p className="col-start-1 row-start-1 translate-y-1 opacity-0 text-muted-foreground/80 [animation:log-in_0.35s_ease-out_5.9s_forwards]">
              ✓ Compiling modules
            </p>
          </div>

          {/* Staggered log lines — appear after the spinner/first line above */}
          <p className="translate-y-1 opacity-0 text-muted-foreground/80 [animation:log-in_0.35s_ease-out_6.4s_forwards]">
            ✓ Optimizing assets
          </p>
          <p className="translate-y-1 opacity-0 text-muted-foreground/80 [animation:log-in_0.35s_ease-out_6.9s_forwards]">
            ✓ Menyiapkan konten halaman
          </p>
          <p className="translate-y-1 opacity-0 text-[#28c840] [animation:log-in_0.35s_ease-out_7.4s_forwards]">
            ✓ Build selesai — siap ditampilkan
          </p>

          <p className="translate-y-1 opacity-0 [animation:log-in_0.35s_ease-out_7.9s_forwards]">
            <span className="text-primary">ratrifa@ratrifa-studio</span>{" "}
            <span className="text-foreground">portfolio %</span>{" "}
            <span className="inline-block h-[15px] w-[8px] translate-y-[3px] bg-foreground/80 animate-[caret_1s_steps(2)_infinite]" />
          </p>
        </div>
      </div>

      <style>{`
        @keyframes caret {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes log-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes type-cmd-20 {
          from { width: 0; }
          to { width: 20ch; }
        }
        @keyframes type-cmd-13 {
          from { width: 0; }
          to { width: 13ch; }
        }
        @keyframes caret-out {
          to { opacity: 0; }
        }
        @keyframes fade-out {
          to { opacity: 0; }
        }
        @keyframes npm-spin {
          from { transform: translateX(0); }
          to { transform: translateX(-10ch); }
        }
      `}</style>
    </div>
  );
}
