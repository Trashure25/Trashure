"use client"

import { useEffect, type CSSProperties } from "react"
import { motion, useAnimation, type Variants } from "framer-motion"

interface AnimatedSloganProps {
  /** Optional callback fired as soon as the text begins animating in. */
  onSloganAnimationStart?: () => void
}

const sloganText = "MAKE YOUR TRASH TREASURE."

/* ------------------------------- Variants ------------------------------- */

const containerVariants: Variants = {
  visible: { opacity: 1, height: "auto" },
  hidden: {
    opacity: 0,
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: { duration: 1, ease: "easeInOut" },
  },
}

const textVariants: Variants = {
  initial: { opacity: 0, y: "25vh", scale: 1.2 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: "circOut" },
  },
  fadeOut: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
}

/* ------------------------------ Component ------------------------------ */

export function AnimatedSlogan({ onSloganAnimationStart }: AnimatedSloganProps) {
  const containerControls = useAnimation()
  const textControls = useAnimation()

  useEffect(() => {
    const sequence = async () => {
      await new Promise((r) => setTimeout(r, 500)) // brief delay
      onSloganAnimationStart?.()

      await textControls.start("visible") // animate in
      await new Promise((r) => setTimeout(r, 2000)) // hold

      await textControls.start("fadeOut") // fade text
      await containerControls.start("hidden") // collapse container
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    sequence()
  }, [containerControls, textControls, onSloganAnimationStart])

  const gradientTextStyle: CSSProperties = {
    backgroundImage: "linear-gradient(to right, #059669, #047857, #065f46, #047857, #059669)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    fontFamily: "var(--font-oswald)", // original heading font
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    fontWeight: 700,
  }

  return (
    <motion.div
      className="py-16 text-center md:py-24"
      style={{ overflow: "hidden" }}
      variants={containerVariants}
      initial="visible"
      animate={containerControls}
    >
      <motion.h1
        className="text-5xl md:text-6xl lg:text-7xl"
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
