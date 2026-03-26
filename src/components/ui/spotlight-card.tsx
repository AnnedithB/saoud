'use client';

import React, { type ReactNode, useEffect, useRef } from 'react';

interface GlowCardProps {
  children?: ReactNode;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
} as const;

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
} as const;

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isTrackingRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const flushPointer = () => {
      rafRef.current = null;
      const card = cardRef.current;
      if (!card) return;
      const { x, y } = pointerRef.current;
      card.style.setProperty('--x', x.toFixed(2));
      card.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
      card.style.setProperty('--y', y.toFixed(2));
      card.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
    };

    const syncPointer = (e: PointerEvent) => {
      const card = cardRef.current;
      if (!card) return;

      // Robust hover detection: pointer events can originate from descendants.
      // Track only when the pointer is actually over this card.
      const isOverCard = e.target instanceof Node && card.contains(e.target);
      isTrackingRef.current = isOverCard;
      if (!isOverCard) return;

      pointerRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current == null) {
        rafRef.current = window.requestAnimationFrame(flushPointer);
      }
    };

    const stopTracking = () => {
      isTrackingRef.current = false;
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    window.addEventListener('pointermove', syncPointer, { passive: true });

    return () => {
      window.removeEventListener('pointermove', syncPointer);
      stopTracking();
    };
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const getSizeClasses = () => {
    if (customSize) return '';
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const baseStyles: React.CSSProperties & Record<string, string | number | undefined> = {
      '--base': base,
      '--spread': spread,
      '--radius': '14',
      '--border': '3',
      '--backdrop': 'hsl(0 0% 60% / 0.12)',
      '--backup-border': 'var(--backdrop)',
      '--size': '200',
      '--outer': '1',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
      )`,
      backgroundColor: 'var(--backdrop, transparent)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      backgroundAttachment: 'scroll',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative',
      touchAction: 'none',
    };

    if (width !== undefined) baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    if (height !== undefined) baseStyles.height = typeof height === 'number' ? `${height}px` : height;

    return baseStyles;
  };

  const beforeAfterStyles = `
    [data-glow] {
      isolation: isolate;
    }

    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: scroll;
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      z-index: 2;
      /* Border-only mask (needs both standard + WebKit on Windows/Chrome). */
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
    }

    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * var(--border-spot-scale, 0.9))
        calc(var(--spotlight-size) * var(--border-spot-scale, 0.9)) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)),
        transparent var(--border-falloff, 72%)
      );
      filter: blur(calc(var(--border-size) * var(--border-spot-blur, 1.1)))
        brightness(var(--border-spot-brightness, 2.4))
        saturate(var(--border-spot-saturate, 1.3));
    }

    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * var(--border-light-scale, 0.6))
        calc(var(--spotlight-size) * var(--border-light-scale, 0.6)) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(0 100% 100% / var(--border-light-opacity, 1)),
        transparent var(--border-light-falloff, 70%)
      );
      filter: blur(calc(var(--border-size) * var(--border-light-blur, 0.9)));
    }

    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
      z-index: 1;
    }

    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          ${!customSize ? 'aspect-[3/4]' : ''}
          rounded-2xl
          relative
          grid
          grid-rows-[1fr_auto]
          shadow-[0_1rem_2rem_-1rem_black]
          p-4
          gap-4
          backdrop-blur-[5px]
          ${className}
        `}
      >
        <div data-glow />
        {children}
      </div>
    </>
  );
};

export { GlowCard };

