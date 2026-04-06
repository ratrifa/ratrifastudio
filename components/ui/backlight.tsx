import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BacklightProps = {
  children?: ReactNode;
  className?: string;
  blur?: number;
};

export function Backlight({ blur = 20, children, className }: BacklightProps) {
  const id = useId();

  return (
    <>
      <svg width="0" height="0" aria-hidden="true">
        <filter id={id} y="-50%" x="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blurred"></feGaussianBlur>
          <feColorMatrix type="saturate" in="blurred" values="4"></feColorMatrix>
          <feComposite in="SourceGraphic" operator="over"></feComposite>
        </filter>
      </svg>

      <div className={cn("inline-flex", className)} style={{ filter: `url(#${id})` }}>
        {children}
      </div>
    </>
  );
}
