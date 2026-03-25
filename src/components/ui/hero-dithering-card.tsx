import { ArrowRight } from "lucide-react";
import React, { lazy, Suspense, useMemo, useState } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then(mod => ({ default: mod.Dithering })),
);

type HeroDitheringBackgroundProps = {
  className?: string;
  /** Hex color string for the dither “front” color. */
  colorFront?: string;
  /** Opacity of the shader layer (0..1). */
  opacity?: number;
  /** Base shader speed when not hovered. */
  speed?: number;
  /** Shader speed when hovered. */
  hoverSpeed?: number;
};

export function HeroDitheringBackground({
  className,
  colorFront = "#7C3AED",
  opacity = 0.35,
  speed = 0.12,
  hoverSpeed = 0.35,
}: HeroDitheringBackgroundProps) {
  const [isHovered, setIsHovered] = useState(false);

  const layerStyle = useMemo(
    () => ({
      opacity,
    }),
    [opacity],
  );

  return (
    <div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
        <div
          className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply dark:mix-blend-screen"
          style={layerStyle}
        >
          <Dithering
            colorBack="#00000000"
            colorFront={colorFront}
            shape="warp"
            type="4x4"
            speed={isHovered ? hoverSpeed : speed}
            className="size-full"
            minPixelRatio={1}
          />
        </div>
      </Suspense>
    </div>
  );
}

// Kept as a self-contained section/demo (per provided snippet).
export function CTASection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-12 w-full flex justify-center items-center px-4 md:px-6">
      <div
        className="w-full max-w-7xl relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[48px] border border-border bg-card shadow-sm min-h-[600px] md:min-h-[600px] flex flex-col items-center justify-center duration-500">
          <Suspense fallback={<div className="absolute inset-0 bg-muted/20" />}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen">
              <Dithering
                colorBack="#00000000"
                colorFront="#7C3AED"
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <div className="relative z-10 px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI-Powered Writing
            </div>

            <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground mb-8 leading-[1.05]">
              Your words, <br />
              <span className="text-foreground/80">delivered perfectly.</span>
            </h2>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Join 2,847 founders using the only AI that understands the nuance of your voice.
              Clean, precise, and uniquely yours.
            </p>

            <button className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-12 text-base font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-95 hover:ring-4 hover:ring-primary/20">
              <span className="relative z-10">Start Typing</span>
              <ArrowRight className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

