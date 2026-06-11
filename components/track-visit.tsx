"use client";

import { useTrackVisit } from "@/lib/use-track-visit";

export function TrackVisit({ path }: { path: string }) {
  useTrackVisit(path);
  return null;
}
