"use client";

import { useEffect, useRef, useState } from "react";

const NATURAL_WIDTH = 1200;

interface ScaledPreviewProps {
  children: React.ReactNode;
}

export function ScaledPreview({ children }: ScaledPreviewProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w > 0) setScale(w / NATURAL_WIDTH);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="w-full overflow-hidden">
      {/* Render at full desktop width, then zoom down to container width.
          zoom (unlike transform:scale) affects layout, so parent height
          adjusts automatically to the scaled content height. */}
      <div style={{ width: NATURAL_WIDTH, zoom: scale } as React.CSSProperties}>
        {children}
      </div>
    </div>
  );
}
