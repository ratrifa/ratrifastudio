"use client";

/**
 * Commit Card Component
 * Display individual commit dengan author, message, timestamp
 */

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpRight, Check } from "lucide-react";
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
    <div className="p-4 transition-colors hover:bg-secondary/40">
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
            <span className="font-mono text-xs text-muted-foreground">{relativeTime}</span>
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
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* SHA chip (clickable untuk copy) */}
            <button
              type="button"
              onClick={handleCopySha}
              title="Click untuk copy full SHA"
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {commit.shortSha}
              {copied && <Check className="size-3" aria-hidden />}
            </button>

            {/* GitHub Link */}
            <Link
              href={commit.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              View on GitHub
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
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
