"use client";

/**
 * Project Detail Header Component
 * Display project image, title, description, metadata
 */

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
        <div className="relative w-full h-96 rounded-lg overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover w-full h-full"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Metadata Badges */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <Badge variant="secondary" className="text-xs">
            Created: {formattedCreatedDate}
          </Badge>

          {formattedUpdatedDate && (
            <Badge variant="secondary" className="text-xs">
              Updated: {formattedUpdatedDate}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
