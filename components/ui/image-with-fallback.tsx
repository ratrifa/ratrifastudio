"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Drop-in replacement for `next/image` (with `fill`) that shows a pulsing
 * skeleton while loading and a muted fallback icon instead of the browser's
 * broken-image icon when the source 404s.
 *
 * Assumes the parent is `relative` with a fixed size — same requirement as
 * `fill`.
 */
export function ImageWithFallback({ className, alt, ...props }: ImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  if (status === "error") {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <ImageOff className="size-6 text-muted-foreground" aria-hidden />
      </div>
    );
  }

  return (
    <>
      {status === "loading" && <Skeleton className="absolute inset-0" />}
      <Image
        {...props}
        alt={alt}
        className={cn(className, "transition-opacity duration-300", status === "loading" ? "opacity-0" : "opacity-100")}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </>
  );
}
