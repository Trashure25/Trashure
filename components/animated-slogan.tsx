"use client"

import { useEffect, type CSSProperties } from "react"
import { motion, useAnimation, type Variants } from "framer-motion"

interface AnimatedSloganProps {
  onSloganAnimationStart: () => void // Callback when text animation begins
}

const sloganText = "MAKE YOUR TRASH TREASURE."

// Variants for the main container (controls final collapse)
const containerVariants: Variants = {
  visible: {
    opacity: 1,
    height: "auto",
    // Padding is handled by className, height: "auto" respects it.
  },
  hidden: {
    opacity: 0,
    height: 0,
    paddingTop: 0, // Collapse padding as well
    paddingBottom: 0,
    transition: { duration: 1.0, ease: "easeInOut" },
  },
}

// Variants for the H1 text element
const textVariants: Variants = {
  initial: {
    opacity: 0,
    y: "25vh", // Start lower (relative to container height)
    scale: 1.2,
  },
  visible: {
    opacity: 1,
    y: 0, // Moves up to its natural position within the container
    scale: 1,
    transition: { duration: 1.0, ease: "circOut" },
  },
  fadeOut: {
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" }, // Faster fade for text
  },
}

export function AnimatedSlogan({ onSloganAnimationStart }: AnimatedSloganProps) {
  const containerControls = useAnimation()
  const textControls = useAnimation()

  useEffect(() => {
    const sequence = async () => {
      // Initial state for container is "visible" (from `initial` prop)
      // Initial state for text is "initial" (from `initial` prop)

      // Phase 1: Brief pause, then text appears and moves into place
      await new Promise((resolve) => setTimeout(resolve, 500)) // 0.5s initial pause
      onSloganAnimationStart() // Signal parent page that text animation is starting
      await textControls.start("visible") // Text animates in (1.0s)

      // Phase 2: Slogan stays visible
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 2.0s visible pause

      // Phase 3: Text fades out, then container collapses
      await textControls.start("fadeOut") // Text fades (0.5s)
      // No extra delay, container starts collapsing as text finishes fading
      await containerControls.start("hidden") // Container collapses (1.0s)
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    sequence()
  }, [containerControls, textControls, onSloganAnimationStart])

  const gradientTextStyle: CSSProperties = {
    backgroundImage: "linear-gradient(to right, #059669, #047857, #065f46, #047857, #059669)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    fontFamily: "var(--font-oswald)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  }

  return (
    <motion.div
      className="text-center py-16 md:py-24" // This defines the space
      style={{ overflow: "hidden" }}
      variants={containerVariants}
      initial="visible" // Starts visible and occupying space
      animate={containerControls}
    >
      <motion.h1
        className="text-5xl md:text-6xl lg:text-7xl font-bold"
        style={gradientTextStyle}
        variants={textVariants}
        initial="initial"
        animate={textControls}
      >
        {sloganText}
      </motion.h1>
    </motion.div>
  )
}
