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
  loading: () => <div className="h-full min-h-[360px] w-full rounded-xl bg-black/5" />,
});
const BugCatcher = dynamic(() => import('@/components/ui/bug-catcher'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full rounded-xl bg-black/5" />,
});
const HarvestRush = dynamic(() => import('@/components/ui/harvest-rush'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full rounded-xl bg-black/5" />,
});
const RiverDodge = dynamic(() => import('@/components/ui/river-dodge'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full rounded-xl bg-black/5" />,
});
const CampfireKeeper = dynamic(() => import('@/components/ui/campfire-keeper'), {
  ssr: false,
  loading: () => <div className="h-full min-h-[360px] w-full rounded-xl bg-black/5" />,
});

function ArcadeStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[300px] sm:w-[360px] flex items-center justify-center">
      <div className="w-full min-h-[360px] sm:min-h-[420px] flex items-center justify-center">
        {children}
      </div>
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
    <HoverSlider className="w-full place-content-center rounded-2xl border border-border bg-[#faf9f5] p-6 text-[#3d3929] md:px-12">
      <div className="flex flex-wrap items-center justify-evenly gap-6 md:gap-12">
        <div className="flex flex-col space-y-2 md:space-y-4">
          {ARCADE_SLIDES.map((slide, index) => (
            <TextStaggerHover
              key={slide.id}
              index={index}
              className="cursor-pointer text-3xl font-bold uppercase tracking-tighter sm:text-4xl"
              text={slide.title}
            />
          ))}
        </div>

        <HoverSliderImageWrap className="w-[300px] sm:w-[360px]">
          <HoverSliderSlide index={0} className="size-full" unmountOnExit>
            <ArcadeStage>
              <div className="w-full h-full rounded-xl overflow-hidden">
                <PixelFishing embedded />
              </div>
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

