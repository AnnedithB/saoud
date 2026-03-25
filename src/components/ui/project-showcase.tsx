"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

interface SkillArea {
  title: string
  description: string
  level: string
  link: string
  image: string
}

const skills: SkillArea[] = [
  {
    title: "Frontend",
    description: "React.js, Next.js, HTML5, CSS3 — clean UI, component systems, and performance-minded UX.",
    level: "Core",
    link: "#projects",
    image: "/img/works/topnewsongs.png",
  },
  {
    title: "Backend",
    description: "Node.js, Express, REST APIs, JWT auth — scalable services, secure auth, and clear contracts.",
    level: "Core",
    link: "#experience",
    image: "/img/works/dependai.png",
  },
  {
    title: "Cloud & DevOps",
    description: "AWS (EC2, S3), GitHub, CI/CD — production deployments, environment security, and automation.",
    level: "Production",
    link: "#contact",
    image: "/img/works/crossroads.png",
  },
  {
    title: "Additional",
    description: "Java (Spring Boot, Hibernate), Flutter (basic), Swift (basic), NLP — quick ramp & solid fundamentals.",
    level: "Also",
    link: "#",
    image: "/img/works/brandit.png",
  },
]

export function ProjectShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothRef = useRef({ x: 0, y: 0 })
  const rectRef = useRef({ left: 0, top: 0 })
  const needsRectUpdateRef = useRef(true)

  const lerp = useMemo(() => {
    return (start: number, end: number, factor: number) => start + (end - start) * factor
  }, [])

  const updateContainerRect = () => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    rectRef.current = { left: rect.left, top: rect.top }
    needsRectUpdateRef.current = false
  }

  const tick = () => {
    const preview = previewRef.current
    if (!preview || !isVisible) {
      rafRef.current = null
      return
    }

    if (needsRectUpdateRef.current) updateContainerRect()

    const nextX = lerp(smoothRef.current.x, mouseRef.current.x, 0.15)
    const nextY = lerp(smoothRef.current.y, mouseRef.current.y, 0.15)
    smoothRef.current = { x: nextX, y: nextY }

    preview.style.left = `${rectRef.current.left}px`
    preview.style.top = `${rectRef.current.top}px`
    preview.style.transform = `translate3d(${nextX + 20}px, ${nextY - 100}px, 0)`

    const dx = Math.abs(mouseRef.current.x - nextX)
    const dy = Math.abs(mouseRef.current.y - nextY)
    if (dx > 0.25 || dy > 0.25) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      rafRef.current = null
    }
  }

  const scheduleTick = () => {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (!isVisible) return

    needsRectUpdateRef.current = true
    updateContainerRect()
    scheduleTick()

    const handleScrollOrResize = () => {
      needsRectUpdateRef.current = true
      scheduleTick()
    }

    window.addEventListener("scroll", handleScrollOrResize, { passive: true })
    window.addEventListener("resize", handleScrollOrResize)
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize)
      window.removeEventListener("resize", handleScrollOrResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    needsRectUpdateRef.current = false
    rectRef.current = { left: rect.left, top: rect.top }
    scheduleTick()
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  const hoveredSkill = hoveredIndex != null ? skills[hoveredIndex] : null

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full"
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Technical Skills
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          MERN-focused full stack engineer with a strong interest in backend architecture, performance optimization,
          and reliable cloud systems.
        </p>
      </div>

      <div
        ref={previewRef}
        className="pointer-events-none fixed z-50 overflow-hidden rounded-xl shadow-2xl will-change-transform"
        style={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          transition:
            "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative w-[280px] h-[180px] bg-secondary rounded-xl overflow-hidden">
          {hoveredSkill ? (
            <img
              key={hoveredSkill.title}
              src={hoveredSkill.image || "/placeholder.svg"}
              alt={hoveredSkill.title}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
              style={{
                opacity: 1,
                scale: 1,
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>
      </div>

      <div className="space-y-0">
        {skills.map((item, index) => (
          <a
            key={item.title}
            href={item.link}
            className="group block"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative py-5 border-t border-border transition-all duration-300 ease-out">
              <div
                className={`
                  absolute inset-0 -mx-4 px-4 bg-secondary/50 rounded-lg
                  transition-all duration-300 ease-out
                  ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-2">
                    <h3 className="text-foreground font-medium text-lg tracking-tight">
                      <span className="relative">
                        {item.title}
                        <span
                          className={`
                            absolute left-0 -bottom-0.5 h-px bg-foreground
                            transition-all duration-300 ease-out
                            ${hoveredIndex === index ? "w-full" : "w-0"}
                          `}
                        />
                      </span>
                    </h3>

                    <ArrowUpRight
                      className={`
                        w-4 h-4 text-muted-foreground
                        transition-all duration-300 ease-out
                        ${
                          hoveredIndex === index
                            ? "opacity-100 translate-x-0 translate-y-0"
                            : "opacity-0 -translate-x-2 translate-y-2"
                        }
                      `}
                    />
                  </div>

                  <p
                    className={`
                      text-muted-foreground text-sm mt-1 leading-relaxed
                      transition-all duration-300 ease-out
                      ${hoveredIndex === index ? "text-foreground/70" : "text-muted-foreground"}
                    `}
                  >
                    {item.description}
                  </p>
                </div>

                <span
                  className={`
                    text-xs font-mono text-muted-foreground tabular-nums
                    transition-all duration-300 ease-out
                    ${hoveredIndex === index ? "text-foreground/60" : ""}
                  `}
                >
                  {item.level}
                </span>
              </div>
            </div>
          </a>
        ))}

        <div className="border-t border-border" />
      </div>
    </section>
  )
}

