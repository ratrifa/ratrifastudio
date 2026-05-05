"use client";

/**
 * Commit Card Component - Changelog Style
 * Display individual commit dalam format timeline changelog
 */

import Link from "next/link";
import { Commit } from "@/lib/commit-types";
import { useCallback, useState } from "react";
import { ExternalLink } from "lucide-react";

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
  const relativeTime = getRelativeTime(commit.date);

  return (
    <Link
      href={commit.htmlUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 py-3 px-3 rounded-md hover:bg-accent/50 transition-colors cursor-pointer"
    >
      {/* Timeline Dot */}
      <div className="flex-shrink-0 pt-1">
        <div className="h-2 w-2 rounded-full bg-muted-foreground/60 group-hover:bg-foreground transition-colors" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mb-1">{relativeTime}</p>

        {/* Commit message */}
        <p className="text-sm font-medium text-foreground break-words group-hover:text-primary transition-colors line-clamp-2">
          {commitTitle}
        </p>

        {/* Author & SHA */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs text-muted-foreground">
            {commit.author.name}
          </span>
          <span
            className="text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleCopySha();
            }}
            title={`Click to copy: ${commit.sha}`}
          >
            {commit.shortSha}
            {copied && " ✓"}
          </span>
        </div>
      </div>
    </Link>
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
