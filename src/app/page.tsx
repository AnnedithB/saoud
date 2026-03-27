import { HeroDitheringBackground } from '@/components/ui/hero-dithering-card';
import { InteractiveRobotSpline } from '@/components/ui/interactive-3d-robot';
import StickyScroll from '@/components/ui/sticky-scroll';
import { GlowCard } from '@/components/ui/spotlight-card';
import { TextScramble } from '@/components/ui/text-scramble';
import TeamMemberCard from '@/components/ui/team-member-card';
import { BackgroundPathsOverlay } from '@/components/ui/background-paths';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { ClientArcadeSlider, ClientProjectShowcase } from '@/components/sections/client-only';
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
} from 'lucide-react';
import { ROBOT_SCENE_URL } from '@/lib/hero-assets';

const PROJECTS_EXTERNAL_URL = 'https://sillylittletools.com/portfolio-1.html';

const NAV_ITEMS = [
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: PROJECTS_EXTERNAL_URL, label: 'Projects' },
  { href: '#arcade', label: 'Arcade' },
  { href: '#contact', label: 'Contact' },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-black text-foreground">
      <div className="relative overflow-hidden">
        <HeroDitheringBackground
          className="absolute inset-0 animate-slow-slide"
          colorFront="#7C3AED"
          opacity={0.35}
          speed={0.12}
          hoverSpeed={0.35}
          defer={false}
          disableOnMobile
        />
        <div className="absolute inset-0 bg-background/45 dark:bg-background/35" />

        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="wrapper flex h-14 items-center justify-between">
            <a
              href="#top"
              className="rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <TextScramble text="Saoud Ahmed" className="scale-[0.7] origin-left" />
            </a>

            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              {NAV_ITEMS.map(item => {
                const isExternal = item.href.startsWith('http');
                return (
                  <a
                    key={item.href}
                    className="rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    href={item.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noreferrer' : undefined}
                  >
                    <TextScramble text={item.label} className="scale-[0.65] origin-left" />
                  </a>
                );
              })}
            </nav>

            <Button asChild size="sm" variant="outline">
              <a href="mailto:saoudahmed02@gmail.com">
                <Mail />
                Email
              </a>
            </Button>
          </div>
        </header>

        <main id="top" className="relative z-10">
          <section className="min-h-[calc(95vh-3.5rem)] flex items-center justify-center relative">
            <div className="absolute inset-0 z-0 pointer-events-none bg-background/55 dark:bg-background/40" />

            <div className="wrapper relative z-10 grid gap-12 items-center md:grid-cols-12">
              <Reveal className="md:col-span-7 text-center md:text-left space-y-7 md:pr-4">
                <p className="text-sm text-muted-foreground ui-fade-up">Full Stack Developer</p>
                <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl ui-fade-up">
                  Building reliable web apps with modern backend architecture.
                </h1>
                <p className="text-muted-foreground text-lg leading-8 max-w-2xl mx-auto md:mx-0 ui-fade-up">
                  MERN-focused engineer building scalable APIs and clean product UX.
                </p>

                <div className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-3">
                  <Button asChild>
                    <a href={PROJECTS_EXTERNAL_URL} target="_blank" rel="noreferrer">
                      View projects
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="#contact">Contact</a>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <a href="mailto:saoudahmed02@gmail.com">
                      <Mail />
                      Email
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <a
                      href="https://www.linkedin.com/in/saoud-ahmed-a92855277"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Linkedin />
                      LinkedIn
                    </a>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <a href="https://github.com/" target="_blank" rel="noreferrer">
                      <Github />
                      GitHub
                    </a>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.08} className="hidden md:flex md:col-span-5 items-center justify-end">
                <div className="relative w-full aspect-square max-w-[460px] rounded-3xl overflow-hidden border border-border bg-black/10 dark:bg-white/5 shadow-2xl">
                  <InteractiveRobotSpline
                    scene={ROBOT_SCENE_URL}
                    className="absolute inset-0"
                    deferUntilInteraction={false}
                    maxDeferMs={0}
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/40" />
                </div>
              </Reveal>
            </div>
          </section>
        </main>
      </div>

      <main className="flex-1 bg-black relative">
        <BackgroundPathsOverlay className="text-white/30" />
        <div className="relative z-10">
          <Separator />

        <section id="projects" className="wrapper py-16">
          <div className="space-y-6">
            <Reveal className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Projects</h2>
              <p className="max-w-3xl text-base md:text-lg leading-7 md:leading-8 text-muted-foreground">
                A few projects that show how I approach architecture, automation, and real-time systems.
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <StickyScroll />
            </Reveal>
          </div>
        </section>

        <Separator />

        <section id="skills" className="wrapper py-16">
          <Reveal>
            <ClientProjectShowcase />
          </Reveal>
        </section>

        <Separator />

        <section id="experience" className="wrapper py-16">
          <Reveal className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Experience</h2>
            <p className="max-w-3xl text-base md:text-lg leading-7 md:leading-8 text-muted-foreground">
              Roles where I’ve shipped features, owned deployments, and improved performance.
            </p>
          </Reveal>

          <div className="mt-10 space-y-10">
            <TeamMemberCard
              position="left"
              jobPosition="Freelancing (Jun 2025 — Present)"
              firstName="Full Stack"
              lastName="Developer"
              imageUrl="/img/works/dependai.png"
              description="Led end-to-end MERN development and deployments. Designed secure REST APIs with Node/Express, optimized MongoDB queries (~30% faster responses), shipped admin dashboards with React/Next, and deployed to AWS EC2 with S3 storage."
              className="my-0"
            />

            <TeamMemberCard
              position="right"
              jobPosition="RubrixCode (Jul 2024 — May 2025)"
              firstName="Full Stack"
              lastName="Developer"
              imageUrl="/img/works/crossroads.png"
              description="Built backend services for data-intensive platforms with Node/Express. Designed and optimized schemas across MongoDB and MySQL, and delivered responsive, component-based UIs using React and Next.js."
              className="my-0"
            />
          </div>
        </section>

        <Separator />

        <section id="arcade" className="wrapper py-16">
          <div className="space-y-6">
            <Reveal className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Arcade</h2>
              <p className="max-w-3xl text-base md:text-lg leading-7 md:leading-8 text-muted-foreground">
                A small game I built for fun. Quick break, then back to shipping.
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <ClientArcadeSlider />
            </Reveal>
          </div>
        </section>

        <Separator />

        <section id="contact" className="wrapper py-16">
          <Reveal>
            <GlowCard
              glowColor="orange"
              customSize
              className="w-full p-0 overflow-hidden [--size:460] [--saturation:155] [--lightness:84] [--bg-spot-opacity:0.42] [--border-spot-opacity:1] [--border-light-opacity:1] [--border-spot-brightness:3.7] [--border-spot-saturate:1.7] [--border-spot-blur:1.6] [--border-spot-scale:1.15] [--border-falloff:58%] [--border-light-scale:0.9] [--border-light-blur:1.25] [--border-light-falloff:56%]"
            >
              <div className="p-6 md:p-8">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                    Let’s build something solid.
                  </h2>
                  <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-7 md:leading-8">
                    If you’re hiring or want help shipping a product end-to-end, I’m available for freelance and full-time opportunities.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <a href="mailto:saoudahmed02@gmail.com">
                      <Mail />
                      Email me
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a
                      href="https://www.linkedin.com/in/saoud-ahmed-a92855277"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Linkedin />
                      Connect on LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        </section>
        </div>
      </main>

      <footer className="bg-black border-t border-border py-10">
        <div className="wrapper flex flex-col gap-2 text-base md:text-lg text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p className="text-muted-foreground/90">© {new Date().getFullYear()} Saoud Ahmed</p>
          <p className="text-muted-foreground/80">
            Redirect:{" "}
            <a
              href="https://www.sillylittletools.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <TextScramble text="www.sillylittletools.com" className="scale-[0.7] origin-left" />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
