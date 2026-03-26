"use client";

import dynamic from "next/dynamic";
import { DeferredRender } from "@/components/ui/deferred-render";

const HeroDitheringBackground = dynamic(
  () => import("@/components/ui/hero-dithering-card").then(m => m.HeroDitheringBackground),
  { ssr: false },
);

const InteractiveRobotSpline = dynamic(
  () => import("@/components/ui/interactive-3d-robot").then(m => m.InteractiveRobotSpline),
  { ssr: false },
);

const GlowCard = dynamic(
  () => import("@/components/ui/spotlight-card").then(m => m.GlowCard),
  { ssr: false },
);

export function HeroBackgroundClient() {
  return (
    <DeferredRender
      // Decorative. Avoid pulling the shader client chunk into the very first task.
      rootMargin="0px"
      fallback={
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/25 via-transparent to-fuchsia-500/20" />
      }
    >
      <HeroDitheringBackground
        className="absolute inset-0 animate-slow-slide"
        colorFront="#7C3AED"
        opacity={0.35}
        speed={0.12}
        hoverSpeed={0.35}
        defer
        disableOnMobile={false}
      />
    </DeferredRender>
  );
}

export function HeroRobotClient({ sceneUrl }: { sceneUrl: string }) {
  return (
    <DeferredRender
      rootMargin="150px"
      fallback={<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30" />}
    >
      <InteractiveRobotSpline scene={sceneUrl} className="absolute inset-0" />
    </DeferredRender>
  );
}

export function ContactGlowCardClient({ children }: { children: React.ReactNode }) {
  return (
    <DeferredRender
      rootMargin="350px"
      fallback={<div className="h-[280px] w-full rounded-2xl border border-border bg-muted/10" />}
    >
      <GlowCard
        glowColor="orange"
        customSize
        className="w-full p-0 overflow-hidden [--size:460] [--saturation:155] [--lightness:84] [--bg-spot-opacity:0.42] [--border-spot-opacity:1] [--border-light-opacity:1] [--border-spot-brightness:3.7] [--border-spot-saturate:1.7] [--border-spot-blur:1.6] [--border-spot-scale:1.15] [--border-falloff:58%] [--border-light-scale:0.9] [--border-light-blur:1.25] [--border-light-falloff:56%]"
      >
        {children}
      </GlowCard>
    </DeferredRender>
  );
}

