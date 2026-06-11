"use client";

/**
 * Project Detail Header Component
 * Display project image, title, description, metadata
 */

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { format } from "date-fns";
import { ImageZoom } from "./animate-ui/primitives/effects/image-zoom";

interface ProjectDetailHeaderProps {
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt?: Date;
}

export function ProjectDetailHeader({
  title,
  description,
  imageUrl,
  createdAt,
  updatedAt,
}: ProjectDetailHeaderProps) {
  const formattedCreatedDate = format(new Date(createdAt), "MMM dd, yyyy");
  const formattedUpdatedDate = updatedAt
    ? format(new Date(updatedAt), "MMM dd, yyyy")
    : null;

  return (
    <div className="space-y-6">
      {/* Project Image */}
      {imageUrl && (
        <div className="relative h-96 w-full overflow-hidden rounded-xl border border-border bg-muted">
          <ImageZoom>
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              fill
              className="h-full w-full object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
            />
          </ImageZoom>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h1 className="font-display text-4xl font-semibold tracking-tight text-balance text-foreground md:text-5xl">
          {title}
        </h1>

        {/* Description */}
        <p className="text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Metadata */}
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 font-mono text-xs text-muted-foreground">
          <span>Created: {formattedCreatedDate}</span>

          {formattedUpdatedDate && (
            <>
              <span aria-hidden className="text-border">
                ·
              </span>
              <span>Updated: {formattedUpdatedDate}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
