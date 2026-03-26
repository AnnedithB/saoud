"use client";

import * as React from "react";

type DeferredRenderProps = React.PropsWithChildren<{
  /** Render when the placeholder is within viewport +/- rootMargin. */
  rootMargin?: string;
  /** Intersection ratio required. */
  threshold?: number | number[];
  /** If true, renders immediately. */
  disabled?: boolean;
  /** Optional placeholder node while deferred. */
  fallback?: React.ReactNode;
}>;

export function DeferredRender({
  children,
  rootMargin = "300px",
  threshold = 0.01,
  disabled = false,
  fallback = null,
}: DeferredRenderProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = React.useState(disabled);

  React.useEffect(() => {
    if (disabled) return;
    if (enabled) return;

    const el = hostRef.current;
    if (!el) return;

    // No IO? Render immediately rather than blocking.
    if (!("IntersectionObserver" in window)) {
      setEnabled(true);
      return;
    }

    let cancelled = false;
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const anyWindow = window as unknown as {
          requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        };

        // Try to avoid competing with initial render/paint.
        anyWindow.requestIdleCallback?.(
          () => {
            if (!cancelled) setEnabled(true);
          },
          { timeout: 1200 },
        ) ?? window.setTimeout(() => (!cancelled ? setEnabled(true) : undefined), 0);
      },
      { root: null, rootMargin, threshold },
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [disabled, enabled, rootMargin, threshold]);

  return <div ref={hostRef}>{enabled ? children : fallback}</div>;
}

