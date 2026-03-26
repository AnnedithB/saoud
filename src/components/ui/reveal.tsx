import * as React from "react";

type RevealProps = React.PropsWithChildren<{
  className?: string;
  /** Seconds. Applied as CSS `animation-delay`. */
  delay?: number;
}>;

/**
 * Lightweight reveal wrapper (CSS-only).
 * Uses the global `.ui-fade-up` keyframes in `globals.css`.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <div
      className={["ui-fade-up", className].filter(Boolean).join(" ")}
      style={delay ? ({ animationDelay: `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

