'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  HoverSlider,
  HoverSliderImageWrap,
  HoverSliderSlide,
  TextStaggerHover,
} from '@/components/ui/animated-slideshow';

const PixelFishing = dynamic(() => import('@/components/ui/pixel-fishing'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full rounded-none bg-black/5" />,
});
const BugCatcher = dynamic(() => import('@/components/ui/bug-catcher'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full rounded-none bg-black/5" />,
});
const HarvestRush = dynamic(() => import('@/components/ui/harvest-rush'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full rounded-none bg-black/5" />,
});
const RiverDodge = dynamic(() => import('@/components/ui/river-dodge'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full rounded-none bg-black/5" />,
});
const CampfireKeeper = dynamic(() => import('@/components/ui/campfire-keeper'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full rounded-none bg-black/5" />,
});

function ArcadeStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full aspect-[4/3] md:aspect-video flex items-center justify-center bg-black/40 border border-white/10 shadow-2xl overflow-hidden relative">
       <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />
       {children}
    </div>
  );
}

const ARCADE_SLIDES = [
  { id: 'slide-1', title: 'Pixel Fishing' },
  { id: 'slide-2', title: 'Bug Catcher' },
  { id: 'slide-3', title: 'Harvest Rush' },
  { id: 'slide-4', title: 'River Dodge' },
  { id: 'slide-5', title: 'Campfire Keeper' },
] as const;

export function ArcadeSlider() {
  return (
    <HoverSlider className="w-full place-content-center rounded-none border border-white/5 bg-white/5 p-8 md:p-16 text-white overflow-hidden">
      <div className="flex flex-col xl:flex-row items-center justify-between gap-16">
        <div className="flex flex-col space-y-4 w-full xl:w-1/3">
          {ARCADE_SLIDES.map((slide, index) => (
            <TextStaggerHover
              key={slide.id}
              index={index}
              className="cursor-pointer text-4xl md:text-5xl font-bold uppercase tracking-tighter hover:text-emerald-500 transition-colors"
              text={slide.title}
            />
          ))}
        </div>

        <HoverSliderImageWrap className="w-full xl:w-[60%]">
          <HoverSliderSlide index={0} className="size-full" unmountOnExit>
            <ArcadeStage>
              <PixelFishing embedded />
            </ArcadeStage>
          </HoverSliderSlide>

          <HoverSliderSlide index={1} className="size-full" unmountOnExit>
            <ArcadeStage>
              <BugCatcher />
            </ArcadeStage>
          </HoverSliderSlide>

          <HoverSliderSlide index={2} className="size-full" unmountOnExit>
            <ArcadeStage>
              <HarvestRush />
            </ArcadeStage>
          </HoverSliderSlide>

          <HoverSliderSlide index={3} className="size-full" unmountOnExit>
            <ArcadeStage>
              <RiverDodge />
            </ArcadeStage>
          </HoverSliderSlide>

          <HoverSliderSlide index={4} className="size-full" unmountOnExit>
            <ArcadeStage>
              <CampfireKeeper />
            </ArcadeStage>
          </HoverSliderSlide>
        </HoverSliderImageWrap>
      </div>
    </HoverSlider>
  );
}

