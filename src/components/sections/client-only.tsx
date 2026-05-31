'use client';

import dynamic from 'next/dynamic';

export const ClientProjectShowcase = dynamic(
  () => import('@/components/ui/project-showcase').then(m => m.ProjectShowcase),
  {
    ssr: false,
    loading: () => <div className="h-[520px] w-full rounded-xl border border-border bg-muted/20" />,
  },
);

export const ClientArcadeSlider = dynamic(
  () => import('@/components/sections/arcade-slider').then(m => m.ArcadeSlider),
  {
    ssr: false,
    loading: () => <div className="h-[520px] w-full rounded-2xl border border-border bg-muted/20" />,
  },
);

