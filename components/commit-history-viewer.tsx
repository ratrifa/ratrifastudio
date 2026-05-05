"use client";

/**
 * Commit History Viewer Component
 * Main container untuk commit history section
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, AlertCircle } from "lucide-react";
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
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">Commit History</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Recent commits dari repository
            </p>
          </div>

          {/* Link ke GitHub */}
          <Link href={githubRepoLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              View on GitHub
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
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
              <div className="pt-2 text-center border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Menampilkan 5 dari {totalCommits} commits
                </p>
                <Link href={githubRepoLink} target="_blank">
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs h-6 px-0 mt-1"
                  >
                    View all commits on GitHub →
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && commits.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No commits found atau repository mungkin private tanpa akses.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
