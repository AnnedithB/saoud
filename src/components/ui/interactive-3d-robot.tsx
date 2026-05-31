'use client';

import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
  /**
   * Keep initial-load TBT low by not initializing Spline until the user interacts
   * (mousemove/touchstart/keydown) or a fallback timeout fires.
   */
  deferUntilInteraction?: boolean;
  /** Safety valve so Spline still appears even without interaction. */
  maxDeferMs?: number;
}

export function InteractiveRobotSpline({
  scene,
  className,
  deferUntilInteraction = true,
  maxDeferMs = 8000,
}: InteractiveRobotSplineProps) {
  const [enabled, setEnabled] = useState(() => !deferUntilInteraction);
  const [prefetched, setPrefetched] = useState(() => !deferUntilInteraction);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const shouldEnableOnIdle = useMemo(() => !deferUntilInteraction, [deferUntilInteraction]);

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
          if (inView) setPrefetched(true);
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
      if (deferUntilInteraction && !inView) return;
      setEnabled(true);
    };

    const onInteract = () => enable();

    const interactEvents: (keyof WindowEventMap)[] = ['mousemove', 'touchstart', 'keydown', 'wheel'];
    if (deferUntilInteraction) {
      for (const evt of interactEvents) {
        window.addEventListener(evt, onInteract, { passive: true, once: true } as AddEventListenerOptions);
      }
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
      for (const evt of interactEvents) {
        window.removeEventListener(evt, onInteract as EventListener);
      }
    };
  }, [deferUntilInteraction, maxDeferMs, scene, shouldEnableOnIdle]);

  // Warm up Spline JS + scene fetch when in view, so interaction doesn't feel "stuck".
  useEffect(() => {
    if (!prefetched) return;
    void import('@splinetool/react-spline');
    // Best-effort scene prefetch; doesn't block render.
    try {
      fetch(scene, { cache: 'force-cache' }).catch(() => {});
    } catch {
      // ignore
    }
  }, [prefetched, scene]);

  useEffect(() => {
    if (!enabled) return;
    void import('@splinetool/react-spline');
  }, [enabled, scene]);

  if (!enabled) {
    return (
      <div
        ref={hostRef}
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

