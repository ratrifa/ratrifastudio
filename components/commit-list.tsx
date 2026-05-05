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

  // Display all commits
  const displayedCommits = commits;

  return (
    <div className="space-y-3">
      {/* Scrollable container untuk semua commits */}
      <div className="relative group">
        {/* Gradient fade at top */}
        <div className="absolute top-0 left-0 right-0 z-10 h-12 bg-gradient-to-b from-background to-transparent pointer-events-none rounded-t-lg" />

        <div
          className="max-h-[600px] overflow-y-auto space-y-3 pr-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-2"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          {displayedCommits.map((commit) => (
            <CommitCard key={commit.sha} commit={commit} />
          ))}
        </div>

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none rounded-b-lg" />
      </div>

      {/* Info text */}
      <p className="text-xs text-muted-foreground text-center">
        Menampilkan {commits.length} commit{commits.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
