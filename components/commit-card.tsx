"use client";

/**
 * Commit Card Component
 * Display individual commit dengan author, message, timestamp
 */

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy } from "lucide-react";
import { Commit } from "@/lib/commit-types";
import { useCallback, useState } from "react";

interface CommitCardProps {
  commit: Commit;
}

export function CommitCard({ commit }: CommitCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySha = useCallback(() => {
    navigator.clipboard.writeText(commit.sha);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [commit.sha]);

  // Format commit message - ambil baris pertama saja
  const commitTitle = commit.message.split("\n")[0];
  const commitBody = commit.message.split("\n").slice(1).join("\n").trim();

  // Format relative time
  const relativeTime = getRelativeTime(commit.date);

  return (
    <div className="rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors p-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage
            src={commit.author.avatarUrl}
            alt={commit.author.name}
          />
          <AvatarFallback>
            {commit.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Author & Timestamp */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{commit.author.name}</span>
            <span className="text-xs text-muted-foreground">{relativeTime}</span>
          </div>

          {/* Commit message */}
          <p className="text-sm font-mono text-foreground mt-2 break-words">
            {commitTitle}
          </p>

          {/* Commit body jika ada */}
          {commitBody && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {commitBody}
            </p>
          )}

          {/* Meta: SHA & Actions */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {/* SHA Badge (clickable untuk copy) */}
            <Badge
              variant="outline"
              className="font-mono text-xs cursor-pointer hover:bg-accent"
              onClick={handleCopySha}
              title="Click untuk copy full SHA"
            >
              {commit.shortSha}
              {copied && <Check className="ml-1 h-3 w-3" />}
            </Badge>

            {/* Email */}
            {commit.author.email && (
              <span className="text-xs text-muted-foreground">
                {commit.author.email}
              </span>
            )}

            {/* GitHub Link */}
            <Link href={commit.htmlUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs gap-1"
              >
                View on GitHub
                <ExternalLink className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper: Format date ke relative time string
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Icon untuk check mark saat copy
function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
