"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function FloatingPaths({ position }: { position: number }) {
  // Keep this light: fewer paths + stable timings (no Math.random in render).
  const PATH_COUNT = 18;

  const paths = React.useMemo(
    () =>
      Array.from({ length: PATH_COUNT }, (_, i) => {
        const width = 0.7 + i * 0.05;
        const opacity = Math.min(0.85, 0.18 + i * 0.035);
        const duration = 18 + (i % 6) * 2; // stable cadence
        const delay = (i % 5) * 0.35;
        return {
          id: i,
          d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
          width,
          opacity,
          duration,
          delay,
        };
      }),
    [position]
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none" aria-hidden="true">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            // Performance: avoid pathLength animation (expensive). Just "flow" the dash offset + opacity.
            initial={false}
            animate={{
              opacity: [path.opacity * 0.55, path.opacity, path.opacity * 0.55],
              pathOffset: [0, 1],
            }}
            transition={{
              duration: path.duration,
              delay: path.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
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
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)} aria-hidden="true">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>
    </div>
  );
}

