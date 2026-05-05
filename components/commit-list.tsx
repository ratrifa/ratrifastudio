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
      {/* Hint text */}
      <p className="text-xs text-muted-foreground text-center">
        Scroll kebawah untuk menampilkan seluruh commit history
      </p>

      {/* Scrollable container untuk semua commits */}
      <div className="relative">
        <div
          className="max-h-[600px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden divide-y divide-border/30 rounded-md border border-border/50"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          {displayedCommits.map((commit) => (
            <CommitCard key={commit.sha} commit={commit} />
          ))}
        </div>
      </div>

      {/* Commit count */}
      <p className="text-xs text-muted-foreground text-center">
        Menampilkan {commits.length} commit{commits.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
