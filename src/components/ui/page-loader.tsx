"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Cinematic timing: 
    // 1. Initial black
    // 2. Cut to title
    // 3. Reveal page
    const timers = [
      setTimeout(() => setStep(1), 800),  // Show Title
      setTimeout(() => setStep(2), 2400), // Fade Title out & Open bars
      setTimeout(() => setIsVisible(false), 3200), // Unmount
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Film Grain / Noise Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] contrast-150 grayscale mix-blend-overlay bg-[url('https://grain-y.com/grain.png')] bg-repeat" />

          {/* Letterbox Bars */}
          <motion.div 
            initial={{ height: "50vh" }}
            animate={{ height: step >= 2 ? "0vh" : "15vh" }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            className="absolute top-0 inset-x-0 bg-black z-20 border-b border-white/5"
          />
          <motion.div 
            initial={{ height: "50vh" }}
            animate={{ height: step >= 2 ? "0vh" : "15vh" }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            className="absolute bottom-0 inset-x-0 bg-black z-20 border-t border-white/5"
          />

          {/* Camera Info Labels */}
          <div className="absolute top-8 left-8 text-[9px] font-mono tracking-[0.4em] text-white/40 uppercase">
            Rec • 24fps
          </div>
          <div className="absolute top-8 right-8 text-[9px] font-mono tracking-[0.4em] text-white/40 uppercase">
            4K UHD • ISO 800
          </div>
          <div className="absolute bottom-8 left-8 text-[9px] font-mono tracking-[0.4em] text-white/40 uppercase">
            Saoud Ahmed Portfolio
          </div>
          <div className="absolute bottom-8 right-8 text-[9px] font-mono tracking-[0.4em] text-white/40 uppercase">
            TC 00:00:24:02
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="title"
                initial={{ opacity: 0, letterSpacing: "1em", filter: "blur(10px)" }}
                animate={{ opacity: 1, letterSpacing: "0.2em", filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center"
              >
                <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-white uppercase italic">
                  Saoud Ahmed
                </h1>
                <div className="h-px w-24 bg-white/20 mt-6" />
                <p className="mt-4 text-[10px] uppercase tracking-[0.5em] text-white/50 font-medium">
                  A Film by the Engineer
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
