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
  maxDeferMs = 0, // Default to 0 (disabled) to prevent automatic TBT spike
}: InteractiveRobotSplineProps) {
  const [enabled, setEnabled] = useState(false);
  const [prefetched, setPrefetched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Never load Spline on mobile

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
      // On desktop, we still respect deferUntilInteraction but we don't force it with a timeout anymore
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

    // Only set a timeout if explicitly requested and > 0
    const timeoutId =
      maxDeferMs > 0 ? window.setTimeout(enable, maxDeferMs) : null;

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (timeoutId != null) window.clearTimeout(timeoutId);
      for (const evt of interactEvents) {
        window.removeEventListener(evt, onInteract as EventListener);
      }
    };
  }, [deferUntilInteraction, maxDeferMs, scene, isMobile]);

  useEffect(() => {
    if (!prefetched || isMobile) return;
    // Removed pre-warm import here as it causes TBT on desktop. 
    // fetch(scene) below is sufficient for non-blocking pre-fetch.
    try {
      fetch(scene, { cache: 'force-cache' }).catch(() => {});
    } catch {
      // ignore
    }
  }, [prefetched, scene, isMobile]);

  if (isMobile || !enabled) {
    return (
      <div
        ref={hostRef}
        className={`w-full h-full flex items-center justify-center bg-black/10 transition-opacity duration-1000 ${className ?? ''}`}
      >
        {/* Mobile static fallback or simple gradient */}
        <div className="h-full w-full bg-gradient-to-br from-purple-900/20 via-black to-black opacity-60" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          ref={hostRef}
          className={`w-full h-full flex items-center justify-center bg-transparent ${className ?? ''}`}
        >
          <div className="h-full w-full bg-gradient-to-br from-purple-900/10 via-black to-black opacity-40" />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}

