import * as React from "react";
import { cn } from "@/lib/utils";

function FloatingPaths({ position, count }: { position: number; count: number }) {
  const paths = Array.from({ length: count }, (_, i) => {
    const width = 0.7 + i * 0.05;
    const opacity = Math.min(0.85, 0.18 + i * 0.035);
    const duration = 18 + (i % 6) * 2; // stable cadence
    const delay = (i % 5) * 0.35;
    const d = `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;
    return { id: i, d, width, opacity, duration, delay };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none" aria-hidden="true">
        {paths.map(path => (
          <path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            strokeDasharray="10 22"
            className="bgpaths-path"
            style={
              {
                animationDuration: `${path.duration}s`,
                animationDelay: `${path.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * Continuous animated background layer (no layout / no min-height).
 * Mount this once behind multiple sections to avoid animation resets.
 */
export function BackgroundPathsOverlay({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
      aria-hidden="true"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes bgpathsDash {
              from { stroke-dashoffset: 0; opacity: 0.55; }
              50% { opacity: 0.9; }
              to { stroke-dashoffset: -420; opacity: 0.55; }
            }
            .bgpaths-path {
              animation-name: bgpathsDash;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
              will-change: stroke-dashoffset, opacity;
            }
            @media (prefers-reduced-motion: reduce) {
              .bgpaths-path { animation: none !important; }
            }
          `,
        }}
      />
      <div className="absolute inset-0">
        <FloatingPaths position={1} count={18} />
        <FloatingPaths position={-1} count={18} />
      </div>
    </div>
  );
}

