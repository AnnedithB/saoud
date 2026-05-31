"use client"

import * as React from "react"
import type { HTMLMotionProps } from "motion/react"
import { MotionConfig, motion } from "motion/react"
import { cn } from "@/lib/utils"

interface TextStaggerHoverProps {
  text: string
  index: number
}

interface HoverSliderImageProps {
  index: number
  imageUrl: string
}

interface HoverSliderSlideProps {
  index: number
  unmountOnExit?: boolean
}

interface HoverSliderProps {}

interface HoverSliderContextValue {
  activeSlide: number
  changeSlide: (index: number) => void
}

function splitText(text: string) {
  const words = text.split(" ").map((word) => word.concat(" "))
  const characters = words.map((word) => word.split("")).flat(1)

  return {
    words,
    characters,
  }
}

const HoverSliderContext = React.createContext<HoverSliderContextValue | undefined>(undefined)

function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext)
  if (context === undefined) {
    throw new Error("useHoverSliderContext must be used within a HoverSliderProvider")
  }
  return context
}

export const HoverSlider = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & HoverSliderProps>(
  ({ children, className, ...props }, ref) => {
    const [activeSlide, setActiveSlide] = React.useState<number>(0)
    const changeSlide = React.useCallback((index: number) => setActiveSlide(index), [])
    return (
      <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
        <div ref={ref as unknown as React.RefObject<HTMLDivElement>} className={className} {...props}>
          {children}
        </div>
      </HoverSliderContext.Provider>
    )
  },
)
HoverSlider.displayName = "HoverSlider"

export const TextStaggerHover = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & TextStaggerHoverProps>(
  ({ text, index, className, ...props }, ref) => {
    const { activeSlide, changeSlide } = useHoverSliderContext()
    const { characters } = splitText(text)
    const isActive = activeSlide === index
    const handleActivate = () => changeSlide(index)
    return (
      <button
        type="button"
        className={cn(
          "relative inline-block origin-bottom overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
          className,
        )}
        {...props}
        ref={ref as unknown as React.RefObject<HTMLButtonElement>}
        onMouseEnter={handleActivate}
        onClick={handleActivate}
      >
        {characters.map((char, charIndex) => (
          <span key={`${char}-${charIndex}`} className="relative inline-block overflow-hidden">
            <MotionConfig
              transition={{
                delay: charIndex * 0.025,
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <motion.span
                className="inline-block opacity-20"
                initial={{ y: "0%" }}
                animate={isActive ? { y: "-110%" } : { y: "0%" }}
              >
                {char}
                {char === " " && charIndex < characters.length - 1 && <>&nbsp;</>}
              </motion.span>

              <motion.span
                className="absolute left-0 top-0 inline-block opacity-100"
                initial={{ y: "110%" }}
                animate={isActive ? { y: "0%" } : { y: "110%" }}
              >
                {char}
              </motion.span>
            </MotionConfig>
          </span>
        ))}
      </button>
    )
  },
)
TextStaggerHover.displayName = "TextStaggerHover"

export const clipPathVariants = {
  visible: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  hidden: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)",
  },
}

export const HoverSliderImageWrap = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full",
          className,
        )}
        {...props}
      />
    )
  },
)
HoverSliderImageWrap.displayName = "HoverSliderImageWrap"

export const HoverSliderImage = React.forwardRef<HTMLImageElement, HTMLMotionProps<"img"> & HoverSliderImageProps>(
  ({ index, imageUrl, className, ...props }, ref) => {
    const { activeSlide } = useHoverSliderContext()
    return (
      <motion.img
        className={cn("inline-block align-middle", className)}
        transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
        variants={clipPathVariants}
        animate={activeSlide === index ? "visible" : "hidden"}
        ref={ref}
        src={imageUrl}
        {...props}
      />
    )
  },
)
HoverSliderImage.displayName = "HoverSliderImage"

export const HoverSliderSlide = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div"> & HoverSliderSlideProps>(
  ({ index, className, children, ...props }, ref) => {
    const { activeSlide } = useHoverSliderContext()
    const isActive = activeSlide === index
    const [shouldRender, setShouldRender] = React.useState(true)

    React.useEffect(() => {
      if (!props.unmountOnExit) return

      let timeoutId: number | null = null

      if (isActive) {
        setShouldRender(true)
      } else {
        // Keep mounted long enough for the clip-path exit animation to finish.
        timeoutId = window.setTimeout(() => setShouldRender(false), 850)
      }

      return () => {
        if (timeoutId) window.clearTimeout(timeoutId)
      }
    }, [isActive, props.unmountOnExit])

    return (
      <motion.div
        className={cn("inline-block align-middle", className)}
        transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
        variants={clipPathVariants}
        animate={isActive ? "visible" : "hidden"}
        ref={ref}
        {...props}
      >
        {props.unmountOnExit ? (shouldRender ? children : null) : children}
      </motion.div>
    )
  },
)
HoverSliderSlide.displayName = "HoverSliderSlide"

