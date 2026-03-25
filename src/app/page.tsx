import PixelFishing from '@/components/ui/pixel-fishing';
import { Button } from '@/components/ui/button';
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
  MapPin,
  Phone,
  Server,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#arcade', label: 'Arcade' },
  { href: '#contact', label: 'Contact' },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="wrapper flex h-14 items-center justify-between">
          <a href="#top" className="font-semibold tracking-tight">
            Saoud Ahmed
          </a>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {NAV_ITEMS.map(item => (
              <a key={item.href} className="hover:text-foreground" href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <Button asChild size="sm" variant="outline">
            <a href="mailto:saoudahmed02@gmail.com">
              <Mail />
              Email
            </a>
          </Button>
        </div>
      </header>

      <main id="top" className="flex-1">
        <section className="wrapper py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12 md:items-start">
            <div className="space-y-6 md:col-span-7">
              <p className="text-sm text-muted-foreground">Full Stack Developer</p>
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                Building reliable web apps with modern backend architecture.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                MERN-focused engineer with experience designing RESTful APIs,
                optimizing database performance, and deploying production-ready
                systems on AWS.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <a href="#projects">View projects</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="#contact">Contact</a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4" /> Islamabad, Pakistan
                </span>
                <a
                  className="inline-flex items-center gap-2 hover:text-foreground"
                  href="tel:+923158910010"
                >
                  <Phone className="size-4" /> (+92) 3158910010
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
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
            </div>

            <div className="md:col-span-5">
              <Card>
                <CardHeader>
                  <CardTitle>Focus areas</CardTitle>
                  <CardDescription>
                    The work I enjoy most: reliable systems, clean UX, and shipping.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-3">
                    <Server className="mt-0.5 size-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="font-medium">Backend architecture</p>
                      <p className="text-sm text-muted-foreground">
                        REST APIs, auth, performance optimization.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Code className="mt-0.5 size-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="font-medium">Frontend delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Next.js, responsive component systems.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Cloud className="mt-0.5 size-5 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="font-medium">Cloud & DevOps</p>
                      <p className="text-sm text-muted-foreground">
                        AWS, CI/CD, production deployments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="about" className="wrapper py-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">About</h2>
              <p className="max-w-3xl leading-8 text-muted-foreground">
                Full Stack Engineer focused on MERN (MongoDB, Express, React, Node) with 1+
                year building scalable web applications and backend systems. I care most
                about backend architecture, performance, and reliable deployments.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        <section id="skills" className="wrapper py-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
              <p className="max-w-3xl text-muted-foreground">
                A practical stack for shipping product end-to-end.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Frontend</CardTitle>
                  <CardDescription>Interfaces that stay fast and predictable.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  React, Next.js, HTML, CSS
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Backend</CardTitle>
                  <CardDescription>APIs and services with clear contracts.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Node.js, Express, REST APIs, JWT auth
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cloud & DevOps</CardTitle>
                  <CardDescription>Deployments you can trust.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  AWS (EC2, S3), GitHub, CI/CD
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Additional</CardTitle>
                  <CardDescription>Useful tools I can ramp quickly.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Java (Spring Boot), Flutter (basic), Swift (basic), NLP
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        <section id="experience" className="wrapper py-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Experience</h2>
              <p className="max-w-3xl text-muted-foreground">
                Roles where I’ve shipped features, owned deployments, and improved performance.
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <CardTitle>Freelancing — Full Stack Developer</CardTitle>
                    <p className="text-sm text-muted-foreground">Jun 2025 — Present</p>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Led end-to-end development and deployment of MERN apps.</li>
                    <li>Designed secure REST APIs with Node.js and Express.</li>
                    <li>Optimized MongoDB queries and indexing; improved response time ~30%.</li>
                    <li>Deployed on AWS EC2 with S3 storage and secure environment setup.</li>
                    <li>Built scalable admin dashboards with React and Next.js.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <CardTitle>RubrixCode — Full Stack Developer</CardTitle>
                    <p className="text-sm text-muted-foreground">Jul 2024 — May 2025</p>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Contributed to client-facing production apps using MERN.</li>
                    <li>Built backend services with Node.js and Express.</li>
                    <li>Designed and optimized schemas across MongoDB and MySQL.</li>
                    <li>Delivered responsive, component-based UI with React and Next.js.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        <section id="projects" className="wrapper py-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
              <p className="max-w-3xl text-muted-foreground">
                A few projects that show how I approach architecture, automation, and real-time systems.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>AuTest</CardTitle>
                  <CardDescription>
                    FastAPI · React · MongoDB · Appium · Node.js · Firebase
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      Scrapes Play Store reviews, cleans/classifies via NLP, and generates structured test cases using a fine-tuned LLM.
                    </li>
                    <li>
                      Appium-based UI crawler builds navigation graphs to improve end-to-end coverage.
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Belle</CardTitle>
                  <CardDescription>
                    Node.js · GraphQL · PostgreSQL · Redis · WebRTC · Socket.IO · Stripe · AWS
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="list-disc space-y-2 pl-5">
                    <li>
                      Real-time product with matching, messaging, and calling on a microservices backend.
                    </li>
                    <li>
                      Photo verification, subscriptions, push notifications, and admin analytics/moderation tooling.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        <section id="arcade" className="wrapper py-16">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Arcade</h2>
              <p className="max-w-3xl text-muted-foreground">
                A small game I built for fun. Quick break, then back to shipping.
              </p>
            </div>

            <div className="flex justify-start">
              <PixelFishing />
            </div>
          </div>
        </section>

        <Separator />

        <section id="contact" className="wrapper py-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl">Let’s build something solid.</CardTitle>
              <CardDescription className="max-w-2xl leading-8">
                If you’re hiring or want help shipping a product end-to-end, I’m available for freelance and full-time opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row">
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
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="wrapper flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Saoud Ahmed</p>
          <p className="text-muted-foreground/80">
            Built with Next.js, TypeScript, Tailwind, and ShadCN-style primitives.
          </p>
        </div>
      </footer>
    </div>
  );
}
