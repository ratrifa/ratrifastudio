"use client";

/**
 * Commit List Component
 * Render list of commits dengan scrollable container jika >5
 */

import { Commit } from "@/lib/commit-types";
import { CommitCard } from "./commit-card";

interface CommitListProps {
  commits: Commit[];
  showAll?: boolean;
}

export function CommitList({ commits, showAll = false }: CommitListProps) {
  if (!commits || commits.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No commits found for this repository.
        </p>
      </div>
    );
  }

  // Show max 5 commits by default, unless showAll is true
  const displayedCommits = showAll ? commits : commits.slice(0, 5);
  const hasMoreCommits = commits.length > 5 && !showAll;

  return (
    <div className="space-y-3">
      {/* Scrollable container jika lebih dari 5 commits */}
      {commits.length > 5 && !showAll ? (
        <div className="relative group">
          {/* Scrollable wrapper */}
          <div
            className="max-h-[500px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-muted"
            style={{
              scrollBehavior: "smooth",
            }}
          >
            {displayedCommits.map((commit) => (
              <CommitCard key={commit.sha} commit={commit} />
            ))}
          </div>

          {/* Gradient fade at bottom untuk hint scroll */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none rounded-b-lg" />

          {/* Scroll hint */}
          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground">
              ↓ Scroll untuk lihat lebih banyak commits ({commits.length} total)
            </p>
          </div>
        </div>
      ) : (
        // Non-scrollable list jika <= 5 commits
        <div className="space-y-3">
          {displayedCommits.map((commit) => (
            <CommitCard key={commit.sha} commit={commit} />
          ))}
        </div>
      )}
    </div>
  );
}
