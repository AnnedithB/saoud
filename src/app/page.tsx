"use client";

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/page-loader';
import { ClientArcadeSlider, ClientProjectShowcase } from '@/components/sections/client-only';

const StickyScroll = dynamic(() => import('@/components/ui/sticky-scroll'), { ssr: false });
const BackgroundPathsOverlay = dynamic(() => import('@/components/ui/background-paths').then(mod => mod.BackgroundPathsOverlay), { ssr: false });
const TeamMemberCard = dynamic(() => import('@/components/ui/team-member-card'), { ssr: false });
const GlowCard = dynamic(() => import('@/components/ui/spotlight-card').then(mod => mod.GlowCard), { ssr: false });
const HeroDitheringBackground = dynamic(() => import('@/components/ui/hero-dithering-card').then(mod => mod.HeroDitheringBackground), { ssr: false });
const InteractiveRobotSpline = dynamic(() => import('@/components/ui/interactive-3d-robot').then(mod => mod.InteractiveRobotSpline), { ssr: false });
import { TextScramble } from '@/components/ui/text-scramble';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Cloud,
  Code,
  Github,
  Linkedin,
  Mail,
  Server,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { ROBOT_SCENE_URL } from '@/lib/hero-assets';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PROJECTS_EXTERNAL_URL = 'https://sillylittletools.com/portfolio-1.html';

const NAV_ITEMS = [
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#arcade', label: 'Arcade' },
  { href: '#contact', label: 'Contact' },
] as const;

function Scene({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <motion.section
      id={id}
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount: 0.1 }}
      variants={{
        initial: { opacity: 0.8, filter: "brightness(0.5) blur(4px)", scale: 1.05 },
        animate: {
          opacity: 1,
          filter: "brightness(1) blur(0px)",
          scale: 1,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
        }
      }}
      className={`relative group/scene ${className}`}
    >
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Cinematic Sweep Flare */}
      <motion.div 
        variants={{
          initial: { left: "-100%", opacity: 0 },
          animate: { 
            left: "200%", 
            opacity: [0, 0.2, 0],
            transition: { duration: 1.5, ease: "easeInOut" }
          }
        }}
        className="absolute top-1/2 -translate-y-1/2 w-96 h-[1px] bg-white/20 blur-xl z-50 pointer-events-none"
      />

       {/* Glitch Pulse Overlay */}
       <motion.div 
         variants={{
           initial: { opacity: 0 },
           animate: { 
             opacity: [0, 0.4, 0],
             transition: { duration: 0.4, ease: "easeInOut", repeat: 0 }
           }
         }}
         className="absolute inset-0 pointer-events-none z-40 bg-emerald-500/5 mix-blend-overlay"
       />
    </motion.section>
  );
}


export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-black text-foreground selection:bg-emerald-500/30 selection:text-white">
      <PageLoader />

      {/* Global Cinematic Overlays */}
      <div className="fixed inset-0 pointer-events-none z-[60] film-grain opacity-20" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] light-leak z-[60] opacity-30" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] light-leak z-[60] opacity-30 px-px translate-y-1/2 -translate-x-1/2" />

      <div className="relative overflow-hidden">
        <HeroDitheringBackground
          className="absolute inset-0 animate-slow-slide"
          colorFront="#7C3AED"
          opacity={0.3}
          speed={0.1}
          hoverSpeed={0.25}
          defer={true}
          disableOnMobile={true}
        />
        <div className="absolute inset-0 bg-black/60 dark:bg-black/40" />

        <header className="fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b border-white/5 bg-black/40 backdrop-blur-md">
          <div className="wrapper h-16 flex items-center justify-between">
            <a
              href="#top"
              className="group flex flex-col focus:outline-none"
            >
              <span className="text-sm font-bold tracking-[0.3em] text-white group-hover:text-emerald-500 transition-colors uppercase italic">
                SAOUD AHMED
              </span>
              <span className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold -mt-0.5">
                SCENE_ARCHITECT
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-10">
              {NAV_ITEMS.map((item, idx) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all flex items-center gap-2 group"
                >
                  <span className="text-[8px] text-white/20 group-hover:text-emerald-500 transition-colors">0{idx + 1}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-6">
              <Button asChild size="sm" variant="ghost" className="hidden sm:flex rounded-none border border-white/10 bg-white/5 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all group">
                <a href="mailto:saoudahmed02@gmail.com">
                  <span className="font-mono text-[9px] uppercase font-bold tracking-[0.3em] text-white">Connect_INT</span>
                </a>
              </Button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center justify-center rounded-none p-2 text-white transition-colors bg-white/5 hover:bg-white/10 md:hidden border border-white/10"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-40 bg-black backdrop-blur-xl border-l border-border md:hidden rounded-none shadow-2xl flex flex-col justify-center items-center gap-12"
            >
              <div className="absolute top-8 left-8 text-[9px] font-mono tracking-[0.4em] text-white/20 uppercase italic">
                MOBILE_ACCESS_v2
              </div>
              <nav className="flex flex-col items-center gap-12">
                {NAV_ITEMS.map((item, idx) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-light uppercase tracking-[0.4em] text-white/60 hover:text-white transition-all flex items-center gap-4 group"
                  >
                    <span className="text-xs text-emerald-500/40 group-hover:text-emerald-500 transition-colors">0{idx + 1}</span>
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="absolute bottom-12 h-px w-24 bg-white/10" />
            </motion.div>
          )}
        </AnimatePresence>






        <section id="hero" className="min-h-[100vh] flex flex-col items-center justify-center relative py-32 overflow-hidden bg-black">
          {/* Cinematic Shutter Intro */}
          <motion.div
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 1, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
            className="absolute inset-0 bg-white z-[70] origin-top pointer-events-none"
          />

          {/* Cinematic Vignette & Grain */}
          <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_200px_rgba(0,0,0,1)] opacity-80" />

          <div className="wrapper relative z-30 flex flex-col items-center text-center">
            <div className="relative flex flex-col items-center space-y-4 mb-24">
              <motion.div
                initial={{ opacity: 0, letterSpacing: "1.2em" }}
                animate={{ opacity: 0.4, letterSpacing: "0.8em" }}
                transition={{ duration: 2, delay: 1 }}
                className="text-[10px] font-mono font-bold text-white uppercase"
              >
                STARRING SAOUD AHMED
              </motion.div>
              <div className="h-px w-24 bg-white/10" />
            </div>

            <Reveal className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 1.4, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              >
                <h1 className="text-white text-7xl md:text-[13rem] font-black leading-[0.8] tracking-[-0.04em] uppercase italic drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  SAOUD <br /> AHMED
                </h1>
              </motion.div>

              <div className="flex flex-col items-center mt-24 space-y-8">
                <p className="text-white/40 text-[10px] md:text-xs font-mono tracking-[0.5em] uppercase max-w-xl leading-relaxed italic">
                  SYSTEMS ARCHITECT // FULL-STACK ENGINEER <br />
                  <span className="text-emerald-500/60 mt-4 block">AVAILABLE FOR PRODUCTION // 2026.REL</span>
                </p>

                <div className="flex items-center gap-12 pt-12">
                  <a href="#projects" className="group flex items-center gap-4">
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-white/60 group-hover:text-white transition-all underline underline-offset-8 decoration-white/10 group-hover:decoration-emerald-500">View Reel</span>
                    <ArrowRight className="size-4 text-emerald-500 group-hover:translate-x-2 transition-transform" />
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Technical Reels Metadata */}
            <div className="absolute bottom-12 left-12 flex flex-col gap-2 items-start opacity-20 hidden md:flex font-mono text-[9px] tracking-widest text-white uppercase italic">
              <span>FPS: 60 [STABLE]</span>
              <span>ISO: 800 [GRAIN_ON]</span>
              <span>SHUTTER: 1/120</span>
            </div>
          </div>

          {/* Background Cinematic Depth */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <motion.div
              initial={{ scale: 1.4, opacity: 0, rotate: -15, filter: "brightness(2) contrast(1.5)" }}
              animate={{ scale: 1.1, opacity: 0.3, rotate: -10, filter: "brightness(1) contrast(1)" }}
              transition={{ duration: 5, ease: "easeOut" }}
              className="size-full flex items-center justify-center opacity-40 translate-x-[20%]"
            >
              <InteractiveRobotSpline
                scene={ROBOT_SCENE_URL}
                className="size-full"
                deferUntilInteraction={true}
              />
            </motion.div>

            {/* Virtual Lens Flare */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/10 z-40 blur-sm mix-blend-screen opacity-30" />
          </div>

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        </section>

      </div>

      <main id="top" className="relative z-10">
        {/* Scroll Progress Shutter Tag */}
        <motion.div
          className="fixed top-0 left-0 w-1 bg-emerald-500 z-[60] origin-top"
          style={{ height: "100%", scaleY: 0 }}
        />

        {/* StickyScroll Section (Cinematic Context) */}
        <Scene id="projects" className="py-24 bg-[#030303]">
          <BackgroundPathsOverlay className="text-white/10" />
          <div className="wrapper relative z-20">
            <div className="mb-24 flex flex-col items-start">
              <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-emerald-500 uppercase mb-4">Scene 03 // Production Portfolio</span>
              <h2 className="text-5xl md:text-7xl font-bold text-white uppercase italic tracking-tighter leading-[1.1]">Featured Work</h2>
              <div className="h-px w-32 bg-white/10 mt-8" />
            </div>
            <StickyScroll />
          </div>
        </Scene>

        <Separator className="bg-white/5 opacity-50" />



        <section id="skills" className="py-32 relative overflow-hidden bg-black">
          <div className="wrapper relative z-20">
            <div className="mb-24 flex flex-col items-center text-center">
              <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-emerald-500 uppercase mb-4">Scene 01 // Technical Syntactics</span>
              <h2 className="text-5xl md:text-7xl font-bold text-white uppercase italic tracking-tighter italic leading-[1.1]">The Arsenal</h2>
              <div className="h-px w-24 bg-white/20 mt-8" />
            </div>
            <ClientProjectShowcase />
          </div>
        </section>

        <Separator className="bg-white/5 opacity-50" />

        <Scene id="experience" className="py-32 bg-black">
          <Reveal className="animate-flash">
            <div className="wrapper relative z-20">
              <div className="mb-24 flex flex-col items-start">
                <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-emerald-500 uppercase mb-4">Scene 04 // Professional Narrative</span>
                <h2 className="text-5xl md:text-7xl font-bold text-white uppercase italic tracking-tighter leading-[1.1]">The Journey</h2>
                <div className="h-px w-32 bg-white/10 mt-8" />
              </div>

              <div className="space-y-48">
                <TeamMemberCard
                  position="left"
                  jobPosition="RUBRIXCODE // 2025"
                  firstName="SENIOR FULL-STACK"
                  lastName="ENGINEER"
                  imageUrl="/img/experience/sltexp.png"
                  description="Architecting distributed AWS microservices and orchestrated high-frequency trade data ingestion pipelines. Scaling infrastructure for mass user adoption using Next.js 15 and Kubernetes."
                />
                <TeamMemberCard
                  position="right"
                  jobPosition="UPWORK ELITE // 2024"
                  firstName="TOP-RATED PLUS"
                  lastName="FREELANCER"
                  imageUrl="/img/experience/dependexp.png"
                  description="Enterprise-grade engineering for global startups. Specialized in performance-critical document conversion engines and real-time collaboration tools with high-stakes delivery."
                />
              </div>
            </div>
          </Reveal>
        </Scene>

        <Separator className="bg-white/5 opacity-50" />

        <Scene id="arcade" className="wrapper py-24">
          <div className="space-y-8">
            <Reveal className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient">The Lab</h2>
              <p className="max-w-3xl text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                Experimenting with game design and interactive web graphics. Quick breach from logic to play.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ClientArcadeSlider />
            </Reveal>
          </div>
        </Scene>

        <Separator className="bg-white/5 opacity-50" />

        <Scene id="contact" className="wrapper py-24">
          <Reveal>
            <GlowCard
              glowColor="purple"
              customSize
              className="w-full p-0 overflow-hidden holographic-border rounded-none [--bg-spot-opacity:0.2] border border-white/5"
            >
              <div className="p-10 md:p-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase italic">
                      Establish <br className="hidden md:block" /> Connection.
                    </h2>
                    <p className="max-w-xl text-lg md:text-xl text-muted-foreground leading-relaxed font-medium">
                      Available for specialized engineering engagements and strategic system architecture.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <Button asChild size="lg" className="rounded-none px-8 h-14 font-bold shadow-xl shadow-white/5 border border-white/20">
                      <a href="mailto:saoudahmed02@gmail.com">
                        <Mail className="mr-2" />
                        Initialize Email
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-none px-8 h-14 font-bold border-white/10 bg-white/5 hover:bg-white/10">
                      <a
                        href="https://www.linkedin.com/in/saoud-ahmed-a92855277"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Linkedin className="mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        </Scene>
      </main>

      <footer className="bg-black border-t border-white/5 py-48 relative overflow-hidden">
        {/* Footer Light Leak */}
        <div className="absolute top-0 right-0 w-96 h-96 light-leak opacity-20" />

        <div className="wrapper flex flex-col gap-24 md:flex-row md:items-end md:justify-between relative z-10">
          <div className="space-y-8 group">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-[0.5em] text-white/30 uppercase mb-2 italic">Fin • Epilogue</span>
              <p className="text-4xl md:text-6xl font-bold tracking-[0.1em] text-white group-hover:text-emerald-500 transition-colors uppercase italic">SAOUD AHMED</p>
            </div>
            <p className="text-[11px] font-mono font-bold text-muted-foreground/40 max-w-sm uppercase tracking-[0.2em] leading-loose">
              SYSTEMS_ENGINEER // ISO_800 <br />
              DEVELOPED_IN_ISLAMABAD // CORE_v4.2
            </p>
          </div>

          <div className="flex flex-col gap-12 md:items-end">
            <div className="flex flex-wrap gap-12">
              <a href="mailto:saoudahmed02@gmail.com" className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">Mailbox</a>
              <a href="https://www.linkedin.com/in/saoud-ahmed-a92855277" target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">LinkedIn</a>
              <a href="https://sillylittletools.com" target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all italic underline decoration-emerald-500/30 underline-offset-8">SillyLittleTools</a>
            </div>
            <p className="text-[9px] font-mono text-white/20 tracking-[0.5em] uppercase">© 2026 // ALL_RIGHTS_RESERVED</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
