import { Code2 } from "lucide-react";

/**
 * Full-screen branded loader shown via `loading.tsx` Suspense boundaries
 * while server components await data from the Laravel API.
 */
export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background">
      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground animate-pulse">
        <Code2 size={22} />
      </span>
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
        <span className="size-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
        <span className="size-2 rounded-full bg-primary animate-bounce" />
      </div>
    </div>
  );
}
