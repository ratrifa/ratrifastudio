"use client";

/**
 * Loading Skeleton Component
 * Placeholder untuk loading states di detail page dan commit history
 */

interface LoadingSkeletonProps {
  type?: "detail" | "commits";
}

export function LoadingSkeleton({ type = "detail" }: LoadingSkeletonProps) {
  if (type === "commits") {
    return (
      <div className="space-y-3">
        {/* Skeleton untuk 5 commits */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <div className="flex gap-3">
              {/* Avatar skeleton */}
              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-muted animate-pulse" />

              <div className="flex-1 space-y-2">
                {/* Author name skeleton */}
                <div className="h-4 w-32 rounded bg-muted animate-pulse" />

                {/* Commit message skeleton */}
                <div className="space-y-1">
                  <div className="h-3 w-full rounded bg-muted animate-pulse" />
                  <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
                </div>

                {/* Metadata skeleton */}
                <div className="flex gap-2 pt-2">
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Detail page skeleton (type === "detail")
  return (
    <div className="space-y-8">
      {/* Header image skeleton */}
      <div className="w-full h-96 rounded-lg bg-muted animate-pulse" />

      {/* Title skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-full rounded bg-muted animate-pulse" />
        <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
      </div>

      {/* Buttons skeleton */}
      <div className="flex gap-3">
        <div className="h-10 w-32 rounded bg-muted animate-pulse" />
        <div className="h-10 w-32 rounded bg-muted animate-pulse" />
      </div>

      {/* Tech stack skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-24 rounded bg-muted animate-pulse" />
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 rounded-full bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Commits section skeleton */}
      <div className="space-y-3">
        <div className="h-5 w-40 rounded bg-muted animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
