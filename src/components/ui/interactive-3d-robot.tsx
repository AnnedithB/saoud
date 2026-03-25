'use client';

import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
  /** Keep initial-load TBT low by requiring an explicit click/tap. */
  requireClickToLoad?: boolean;
  /** Safety valve so Spline still appears even without clicking. Set 0 to disable. */
  maxDeferMs?: number;
}

export function InteractiveRobotSpline({
  scene,
  className,
  requireClickToLoad = true,
  maxDeferMs = 0,
}: InteractiveRobotSplineProps) {
  const [enabled, setEnabled] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const shouldEnableOnIdle = useMemo(() => !requireClickToLoad, [requireClickToLoad]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;

    let inView = true;
    let observer: IntersectionObserver | null = null;
    if (hostRef.current && 'IntersectionObserver' in window) {
      inView = false;
      observer = new IntersectionObserver(
        entries => {
          const entry = entries[0];
          inView = Boolean(entry?.isIntersecting);
        },
        { root: null, threshold: 0.15 },
      );
      observer.observe(hostRef.current);
    }

    let cancelled = false;
    const anyWindow = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const enable = () => {
      if (cancelled) return;
      if (!inView) return;
      setEnabled(true);
    };

    // If click-to-load is enabled, we don't auto-enable based on passive events
    // because tools like Lighthouse can generate them and trigger the heavy init.
    const host = hostRef.current;
    const onClick = () => enable();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') enable();
    };
    if (requireClickToLoad && host) {
      host.addEventListener('pointerdown', onClick, { passive: true, once: true });
      host.addEventListener('keydown', onKeyDown, { once: true });
    }

    const idleId =
      shouldEnableOnIdle
        ? (anyWindow.requestIdleCallback?.(enable, { timeout: 2500 }) ??
          window.setTimeout(enable, 1200))
        : null;

    const timeoutId =
      maxDeferMs > 0 ? window.setTimeout(enable, maxDeferMs) : null;

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (idleId != null && typeof idleId === 'number') {
        anyWindow.cancelIdleCallback?.(idleId);
        window.clearTimeout(idleId);
      }
      if (timeoutId != null) window.clearTimeout(timeoutId);
      if (requireClickToLoad && host) {
        host.removeEventListener('pointerdown', onClick as EventListener);
        host.removeEventListener('keydown', onKeyDown as EventListener);
      }
    };
  }, [maxDeferMs, requireClickToLoad, scene, shouldEnableOnIdle]);

  useEffect(() => {
    if (!enabled) return;
    void import('@splinetool/react-spline');
  }, [enabled, scene]);

  if (!enabled) {
    return (
      <div
        ref={hostRef}
        className={`w-full h-full flex items-center justify-center bg-black/10 dark:bg-white/5 ${className ?? ''}`}
        role={requireClickToLoad ? 'button' : undefined}
        tabIndex={requireClickToLoad ? 0 : undefined}
        aria-label={requireClickToLoad ? 'Load 3D' : undefined}
      >
        <div className="h-full w-full bg-gradient-to-b from-transparent via-transparent to-background/30" />
        {requireClickToLoad ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-border bg-background/80 px-4 py-2 text-xs text-foreground backdrop-blur">
              Tap to load 3D
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          ref={hostRef}
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

