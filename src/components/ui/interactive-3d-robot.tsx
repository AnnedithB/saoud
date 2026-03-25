'use client';

import { Suspense, lazy, useEffect } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  // Start downloading both the Spline runtime chunk + the scene ASAP.
  // This doesn't change visuals, it just warms caches for first render.
  useEffect(() => {
    void import('@splinetool/react-spline');

    try {
      const controller = new AbortController();
      // Low-priority warmup fetch; safe to ignore failures.
      void fetch(scene, { signal: controller.signal, cache: 'force-cache' }).catch(() => {});
      return () => controller.abort();
    } catch {
      return;
    }
  }, [scene]);

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

