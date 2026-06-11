"use client";

/**
 * Commit History Viewer Component
 * Main container untuk commit history section
 */

import Link from "next/link";
import { ExternalLink, AlertCircle, ArrowUpRight } from "lucide-react";
import { Commit } from "@/lib/commit-types";
import { CommitList } from "./commit-list";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CommitHistoryViewerProps {
  commits: Commit[];
  isLoading?: boolean;
  error?: string;
  repoUrl: string;
  totalCommits?: number;
}

export function CommitHistoryViewer({
  commits,
  isLoading = false,
  error,
  repoUrl,
  totalCommits,
}: CommitHistoryViewerProps) {
  // Extract GitHub repo URL untuk display link
  const githubRepoLink = repoUrl;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">Commit History</h2>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">Recent commits dari repository</p>
        </div>

        {/* Link ke GitHub */}
        <Link
          href={githubRepoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          GitHub
          <ExternalLink className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="space-y-4 p-5">
        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Commits List */}
        {!isLoading && !error && (
          <>
            <CommitList commits={commits} showAll={false} />

            {/* Info tentang total commits */}
            {totalCommits !== undefined && totalCommits > 5 && (
              <div className="border-t border-border pt-3 text-center">
                <p className="font-mono text-xs text-muted-foreground">Menampilkan {totalCommits} commits</p>
                <Link
                  href={githubRepoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  View all commits on GitHub
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                </Link>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && commits.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-muted/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No commits found atau repository mungkin private tanpa akses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
