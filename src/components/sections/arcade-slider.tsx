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
    <div className="relative group/arcade overflow-hidden">
      {/* Retro Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[5] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-pulse" />
      
      <HoverSlider className="w-full place-content-center rounded-none border-4 border-white/20 bg-[#0a0a0a] p-8 md:p-16 text-white overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-16 relative z-10">
          <div className="flex flex-col space-y-6 w-full xl:w-1/3">
            {ARCADE_SLIDES.map((slide, index) => (
              <div key={slide.id} className="group/item">
                <TextStaggerHover
                  index={index}
                  className="cursor-pointer text-4xl md:text-5xl font-bold uppercase tracking-tighter hover:text-emerald-500 transition-colors font-mono pixel-text"
                  text={slide.title}
                />
              </div>
            ))}
          </div>

          <HoverSliderImageWrap className="w-full xl:w-[60%] relative">
             {/* Pixel Corner Decorations */}
             <div className="absolute -top-2 -left-2 size-4 border-t-4 border-l-4 border-emerald-500 z-20" />
             <div className="absolute -top-2 -right-2 size-4 border-t-4 border-r-4 border-emerald-500 z-20" />
             <div className="absolute -bottom-2 -left-2 size-4 border-b-4 border-l-4 border-emerald-500 z-20" />
             <div className="absolute -bottom-2 -right-2 size-4 border-b-4 border-r-4 border-emerald-500 z-20" />

            <HoverSliderSlide index={0} className="size-full" unmountOnExit>
              <ArcadeStage>
                <div className="absolute inset-0 z-[1] pixel-grid opacity-20 pointer-events-none" />
                <PixelFishing embedded />
              </ArcadeStage>
            </HoverSliderSlide>

            <HoverSliderSlide index={1} className="size-full" unmountOnExit>
              <ArcadeStage>
                <div className="absolute inset-0 z-[1] pixel-grid opacity-20 pointer-events-none" />
                <BugCatcher />
              </ArcadeStage>
            </HoverSliderSlide>

            <HoverSliderSlide index={2} className="size-full" unmountOnExit>
              <ArcadeStage>
                <div className="absolute inset-0 z-[1] pixel-grid opacity-20 pointer-events-none" />
                <HarvestRush />
              </ArcadeStage>
            </HoverSliderSlide>

            <HoverSliderSlide index={3} className="size-full" unmountOnExit>
              <ArcadeStage>
                <div className="absolute inset-0 z-[1] pixel-grid opacity-20 pointer-events-none" />
                <RiverDodge />
              </ArcadeStage>
            </HoverSliderSlide>

            <HoverSliderSlide index={4} className="size-full" unmountOnExit>
              <ArcadeStage>
                <div className="absolute inset-0 z-[1] pixel-grid opacity-20 pointer-events-none" />
                <CampfireKeeper />
              </ArcadeStage>
            </HoverSliderSlide>
          </HoverSliderImageWrap>
        </div>
      </HoverSlider>
    </div>
  );
}

