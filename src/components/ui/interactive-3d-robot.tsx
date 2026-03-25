'use client';

import { Suspense, lazy, useEffect, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;

    let cancelled = false;
    const anyWindow = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const id =
      anyWindow.requestIdleCallback?.(
        () => {
          if (!cancelled) setEnabled(true);
        },
        { timeout: 2000 },
      ) ??
      window.setTimeout(() => {
        if (!cancelled) setEnabled(true);
      }, 900);

    return () => {
      cancelled = true;
      if (typeof id === 'number') {
        anyWindow.cancelIdleCallback?.(id);
        window.clearTimeout(id);
      }
    };
  }, [scene]);

  useEffect(() => {
    if (!enabled) return;
    void import('@splinetool/react-spline');
    try {
      const controller = new AbortController();
      void fetch(scene, { signal: controller.signal, cache: 'force-cache' }).catch(() => {});
      return () => controller.abort();
    } catch {
      return;
    }
  }, [enabled, scene]);

  if (!enabled) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-black/10 dark:bg-white/5 ${className ?? ''}`}
      >
        <div className="h-full w-full bg-gradient-to-b from-transparent via-transparent to-background/30" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          className={`w-full h-full flex items-center justify-center bg-gray-900 text-white ${className ?? ''}`}
        >
          <svg
            className="animate-spin h-5 w-5 text-white mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
            ></path>
          </svg>
          Loading 3D…
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}

