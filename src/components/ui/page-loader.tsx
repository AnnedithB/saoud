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

  const COLS = isMobile ? 4 : 6; 
  const ROWS = isMobile ? 10 : 8; // Sufficient to cover 100vh with room
  const TOTAL = COLS * ROWS;

  const gridItems = useMemo(() => {
    const pool = shuffle(PROJECT_IMAGES);
    return Array.from({ length: TOTAL }).map((_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const colC = (COLS - 1) / 2;
      const rowC = (ROWS - 1) / 2;
      
      // Target directions requested by user
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
        popDelay: Math.random() * 0.8, // Faster pop
        vanishDelay: Math.random() * 0.2,
        tx,
        ty,
      };
    });
  }, [TOTAL, COLS, ROWS]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),           // Title in faster
      setTimeout(() => setStep(2), 1400),          // Cells explode faster
      setTimeout(() => setIsVisible(false), 2000), // Reveal hero earlier for mobile LCP
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
            filter: "brightness(2)", // Blow out for faster feel
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] bg-black overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridAutoRows: `calc(100vh / ${ROWS})`, // Force exact screen height coverage
              gap: "1px",
              alignContent: "start",
            }}
          >
            {gridItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8, borderRadius: "0%" }}
                animate={
                  step >= 2
                    ? {
                      opacity: 0,
                      scale: 0.05,
                      x: `${item.tx}%`,
                      y: `${item.ty}%`,
                      borderRadius: "0%",
                      filter: "blur(20px)",
                    }
                    : {
                      opacity: 0.45,
                      scale: 1,
                      x: "0%",
                      y: "0%",
                      borderRadius: "0%",
                      filter: "blur(0px)",
                    }
                }
                transition={{
                  delay: step >= 2 ? item.vanishDelay : item.popDelay,
                  duration: step >= 2 ? 0.4 : 0.6,
                  ease: step >= 2 ? [0.55, 0.05, 1, 0.5] : [0.23, 1, 0.32, 1],
                }}
                className="relative overflow-hidden bg-neutral-900 border-[0.5px] border-white/5"
              >
                <div className="absolute inset-0">
                  <Image 
                    src={item.image} 
                    alt="Project" 
                    fill 
                    sizes="(max-width: 768px) 25vw, 17vw"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                    priority={item.id < 12}
                    quality={25}
                  />
                </div>
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

          {/* HUD labels */}
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute top-7 left-7 z-30 text-[10px] font-mono tracking-[0.4em] text-white uppercase">Stream • Active</motion.span>
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute top-7 right-7 z-30 text-[10px] font-mono tracking-[0.4em] text-white uppercase">Buffer: 100%</motion.span>
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute bottom-7 left-7 z-30 text-[10px] font-mono tracking-[0.4em] text-white uppercase">SA Portfolio — 2026</motion.span>
          <motion.span animate={{ opacity: step >= 2 ? 0 : 0.45 }} transition={{ duration: 0.4 }} className="absolute bottom-7 right-7 z-30 text-[10px] font-mono tracking-[0.4em] text-white uppercase">REF: SA-01</motion.span>

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
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center text-center px-4 w-full"
                >
                  <h1
                    className="font-extralight text-white uppercase italic leading-none drop-shadow-2xl"
                    style={{
                      fontSize: "clamp(2.4rem, 9vw, 8rem)",
                      letterSpacing: "0.25em",
                      maxWidth: "90vw",
                    }}
                  >
                    Saoud&nbsp;Ahmed
                  </h1>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 1.0, ease: [0.23, 1, 0.32, 1] }}
                    className="h-px bg-white/40 mt-6 origin-left"
                    style={{ width: "clamp(60px, 8vw, 120px)" }}
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 0.45, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.9 }}
                    className="mt-4 text-white font-medium uppercase"
                    style={{
                      fontSize: "clamp(8px, 1vw, 11px)",
                      letterSpacing: "0.7em",
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
