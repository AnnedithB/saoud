"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useMemo } from "react";

const VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-1728-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-binary-code-data-4340-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-4422-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-computational-machine-4100-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-keyboard-typing-close-up-hands-and-fingers-4113-large.mp4",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const COLS = 6; // 6 square columns → rows auto-fit
const ROWS = 6; // extra rows ensure bottom of screen is covered
const TOTAL = COLS * ROWS;

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(0);
  // step 0: grid pops in
  // step 1: title appears
  // step 2: cells explode outward → zoom-punch fade

  const gridItems = useMemo(() => {
    const pool = shuffle(VIDEOS);
    return Array.from({ length: TOTAL }).map((_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      // Normalized direction from grid center for the "explode" scatter
      const colC = (COLS - 1) / 2;
      const rowC = (ROWS - 1) / 2;
      const dx = col === colC ? 0 : (col - colC) / colC;
      const dy = row === rowC ? 0 : (row - rowC) / rowC;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      return {
        id: i,
        video: pool[i % pool.length],
        popDelay: Math.random() * 1.5,
        vanishDelay: Math.random() * 0.28,
        // scatter: pixels to fly in explode direction
        tx: dx * 160,
        ty: dy * 160,
        angle,
      };
    });
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1800),          // Title in
      setTimeout(() => setStep(2), 4400),          // Cells explode
      setTimeout(() => setIsVisible(false), 5400), // Zoom-punch fade done → reveal hero
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.14,
            filter: "brightness(0)",
          }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.6, 1] }}
          className="fixed inset-0 z-[100] bg-black overflow-hidden"
        >
          {/* ── Square video grid ──────────────────────────────── */}
          {/* gridAutoRows = same as column width → perfect squares */}
          <div
            className="absolute inset-0"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridAutoRows: `calc((100vw - ${(COLS - 1) * 3}px) / ${COLS})`,
              gap: "3px",
              // Align from top so bottom overflow is clipped, not top
              alignContent: "start",
            }}
          >
            {gridItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.55, borderRadius: "50%" }}
                animate={
                  step >= 2
                    ? {
                      opacity: 0,
                      scale: 0.05,
                      x: `${item.tx}%`,
                      y: `${item.ty}%`,
                      borderRadius: "50%",
                      filter: "blur(10px)",
                    }
                    : {
                      opacity: 0.6,
                      scale: 1,
                      x: "0%",
                      y: "0%",
                      borderRadius: "0%",
                      filter: "blur(0px)",
                    }
                }
                transition={{
                  delay: step >= 2 ? item.vanishDelay : item.popDelay,
                  duration: step >= 2 ? 0.55 : 1.0,
                  ease:
                    step >= 2
                      ? [0.55, 0.05, 1, 0.5]
                      : [0.23, 1, 0.32, 1],
                }}
                className="relative overflow-hidden bg-neutral-900"
              >
                <video
                  src={item.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* subtle per-cell dark tint so grid lines read */}
                <div className="absolute inset-0 bg-black/30" />
              </motion.div>
            ))}
          </div>

          {/* Radial vignette — darkens edges, highlights center for title */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(ellipse 52% 48% at 50% 50%, transparent 0%, rgba(0,0,0,0.93) 100%)",
            }}
          />

          {/* Film grain */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-10 contrast-150 grayscale mix-blend-overlay bg-[url('https://grain-y.com/grain.png')] bg-repeat" />

          {/* Letterbox bars */}
          <motion.div
            initial={{ height: "40vh" }}
            animate={{ height: step >= 2 ? "0vh" : "12vh" }}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
            className="absolute top-0 inset-x-0 bg-black z-20 border-b border-white/10"
          />
          <motion.div
            initial={{ height: "40vh" }}
            animate={{ height: step >= 2 ? "0vh" : "12vh" }}
            transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
            className="absolute bottom-0 inset-x-0 bg-black z-20 border-t border-white/10"
          />

          {/* HUD labels */}
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute top-7 left-7 z-30 text-[10px] font-mono tracking-[0.4em] text-white uppercase">Stream • Active</motion.span>
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute top-7 right-7 z-30 text-[10px] font-mono tracking-[0.4em] text-white uppercase">Buffer: 100%</motion.span>
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute bottom-7 left-7 z-30 text-[10px] font-mono tracking-[0.4em] text-white uppercase">SA Portfolio — 2026</motion.span>
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute bottom-7 right-7 z-30 text-[10px] font-mono tracking-[0.4em] text-white uppercase">REF: SA-01</motion.span>

          {/* Center title — fluid font size so it fits on any screen */}
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  key="title"
                  initial={{ opacity: 0, y: 16, filter: "blur(20px)" }}
                  animate={{
                    opacity: step >= 2 ? 0 : 1,
                    y: step >= 2 ? -10 : 0,
                    filter: step >= 2 ? "blur(20px)" : "blur(0px)",
                    scale: step >= 2 ? 1.1 : 1,
                  }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center px-4 w-full"
                >
                  {/* clamp ensures name fills ~80% of viewport width */}
                  <h1
                    className="font-extralight text-white uppercase italic leading-none drop-shadow-2xl"
                    style={{
                      fontSize: "clamp(2.8rem, 9.5vw, 9rem)",
                      letterSpacing: "0.22em",
                      // letterSpacing eats into available width — compensate
                      maxWidth: "90vw",
                    }}
                  >
                    Saoud&nbsp;Ahmed
                  </h1>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 1.3, ease: [0.23, 1, 0.32, 1] }}
                    className="h-px bg-white/50 mt-6 origin-left"
                    style={{ width: "clamp(70px, 10vw, 130px)" }}
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.55, y: 0 }}
                    transition={{ delay: 1.0, duration: 1.1 }}
                    className="mt-4 text-white font-medium uppercase"
                    style={{
                      fontSize: "clamp(8px, 1.1vw, 12px)",
                      letterSpacing: "0.65em",
                    }}
                  >
                    A Film by an Engineer
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </motion.div>
      )}
    </AnimatePresence>
  );
}
