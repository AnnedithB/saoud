import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

const PROJECT_IMAGES = [
  '/img/projects/brandit.png',
  '/img/projects/crossroads.png',
  '/img/projects/sanlorenzo.png',
  '/img/projects/topnewsongs.png',
  '/img/projects/arli.png',
  '/img/projects/ink.png',
  '/img/projects/fileconverter.png',
  '/img/projects/dependai.png',
  '/img/projects/holidayupsell.png',
  '/img/projects/sillylittletools.png',
  '/img/projects/aegean1.png',
  '/img/projects/holyghost.png',
  '/img/projects/futures.png',
  '/img/projects/justjobs.png',
  '/img/projects/kitimat.png',
  '/img/projects/plhh.png',
  '/img/projects/belle.png',
  '/img/projects/autest.jpeg',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [step, setStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const COLS = isMobile ? 3 : 6; 
  const ROWS = isMobile ? 8 : 8;
  const TOTAL = COLS * ROWS;

  const gridItems = useMemo(() => {
    const pool = shuffle(PROJECT_IMAGES);
    return Array.from({ length: TOTAL }).map((_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const colC = (COLS - 1) / 2;
      const rowC = (ROWS - 1) / 2;
      
      let tx = 0;
      let ty = 0;

      if (col <= colC && row <= rowC) {
        tx = 0; ty = -200;
      } else if (col > colC && row <= rowC) {
        tx = 200; ty = -200;
      } else if (col <= colC && row > rowC) {
        tx = -200; ty = 200;
      } else if (col > colC && row > rowC) {
        tx = 200; ty = 200;
      }

      return {
        id: i,
        image: pool[i % pool.length],
        popDelay: Math.random() * 0.6,
        vanishDelay: Math.random() * 0.15,
        tx,
        ty,
      };
    });
  }, [TOTAL, COLS, ROWS]);

  useEffect(() => {
    const mob = window.innerWidth < 768;
    const timers = [
      setTimeout(() => setStep(1), mob ? 600 : 500),           
      setTimeout(() => setStep(2), mob ? 3400 : 1800),          
      setTimeout(() => setIsVisible(false), mob ? 4200 : 2500), 
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
            scale: 1.05,
            filter: "brightness(2)",
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] bg-black overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridAutoRows: `calc(100vh / ${ROWS})`,
              gap: "1px",
              alignContent: "start",
            }}
          >
            {gridItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={
                  step >= 2
                    ? {
                      opacity: 0,
                      scale: 0.05,
                      x: `${item.tx}%`,
                      y: `${item.ty}%`,
                      filter: "blur(20px)",
                    }
                    : {
                      opacity: 0.45,
                      scale: 1,
                      x: "0%",
                      y: "0%",
                      filter: "blur(0px)",
                    }
                }
                transition={{
                  delay: step >= 2 ? item.vanishDelay : item.popDelay,
                  duration: step >= 2 ? 0.4 : 0.5,
                  ease: step >= 2 ? [0.55, 0.05, 1, 0.5] : [0.23, 1, 0.32, 1],
                }}
                className="relative overflow-hidden bg-neutral-900 border-[0.5px] border-white/5"
              >
                {/* On mobile: lightweight CSS bg-image to avoid decode lag. On desktop: next/image for quality */}
                {isMobile ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center grayscale"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                ) : (
                  <div className="absolute inset-0">
                    <Image 
                      src={item.image} 
                      alt="Project" 
                      fill 
                      sizes="17vw"
                      className="object-cover grayscale" 
                      priority={item.id < 12}
                      quality={25}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40" />
              </motion.div>
            ))}
          </div>

          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: "radial-gradient(ellipse 52% 48% at 50% 50%, transparent 0%, rgba(0,0,0,0.95) 100%)",
            }}
          />

          <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 contrast-150 grayscale mix-blend-overlay bg-[url('https://grain-y.com/grain.png')] bg-repeat" />

          {/* HUD labels — smaller and tighter on mobile */}
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute top-5 left-5 md:top-7 md:left-7 z-30 text-[8px] md:text-[10px] font-mono tracking-[0.3em] md:tracking-[0.4em] text-white uppercase">Stream • Active</motion.span>
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute top-5 right-5 md:top-7 md:right-7 z-30 text-[8px] md:text-[10px] font-mono tracking-[0.3em] md:tracking-[0.4em] text-white uppercase">Buffer: 100%</motion.span>
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute bottom-5 left-5 md:bottom-7 md:left-7 z-30 text-[8px] md:text-[10px] font-mono tracking-[0.3em] md:tracking-[0.4em] text-white uppercase">SA Portfolio — 2026</motion.span>
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute bottom-5 right-5 md:bottom-7 md:right-7 z-30 text-[8px] md:text-[10px] font-mono tracking-[0.3em] md:tracking-[0.4em] text-white uppercase">REF: SA-01</motion.span>

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
                    scale: step >= 2 ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center px-6 w-full"
                >
                  <h1
                    className="font-extralight text-white uppercase italic leading-[0.95] drop-shadow-2xl"
                    style={{
                      fontSize: "clamp(2rem, 12vw, 8rem)",
                      letterSpacing: "0.15em",
                      maxWidth: "90vw",
                    }}
                  >
                    {/* Stack on mobile, inline on desktop */}
                    <span className="block md:inline">Saoud</span>
                    <span className="block md:inline md:before:content-['\00a0']">Ahmed</span>
                  </h1>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="h-px bg-white/40 mt-4 md:mt-6 origin-left"
                    style={{ width: "clamp(40px, 8vw, 120px)" }}
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.45, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="mt-3 md:mt-4 text-white font-medium uppercase"
                    style={{
                      fontSize: "clamp(7px, 1.2vw, 11px)",
                      letterSpacing: "0.5em",
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
