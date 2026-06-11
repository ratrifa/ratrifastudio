"use client";

import { useEffect, useRef } from "react";

export function useTrackVisit(path: string) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => {
      // Silent fail
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
