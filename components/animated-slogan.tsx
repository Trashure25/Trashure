"use client"

import { useEffect, type CSSProperties } from "react"
import { motion, useAnimation, type Variants } from "framer-motion"

interface AnimatedSloganProps {
  onAnimationComplete?: () => void
}

const sloganText = "MAKE YOUR TRASH TREASURE."

const containerVariants: Variants = {
  initial: { opacity: 1, height: "auto", paddingTop: "6rem", paddingBottom: "6rem" },
  hidden: {
    opacity: 0,
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: { duration: 1, ease: "easeInOut", delay: 0.5 },
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

export function AnimatedSlogan({ onAnimationComplete }: AnimatedSloganProps) {
  const containerControls = useAnimation()
  const textControls = useAnimation()

  useEffect(() => {
    const sequence = async () => {
      await new Promise((r) => setTimeout(r, 500))
      await textControls.start("visible")
      await new Promise((r) => setTimeout(r, 2000))

      void textControls.start("fadeOut")
      void containerControls.start("hidden")

      await new Promise((r) => setTimeout(r, 1500))
      onAnimationComplete?.()
    }

    sequence().catch(console.error)
  }, [containerControls, textControls, onAnimationComplete])

  const gradientTextStyle: CSSProperties = {
    backgroundImage: "linear-gradient(to right, #059669, #047857, #065f46, #047857, #059669)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    fontFamily: "var(--font-oswald)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    fontWeight: 700,
  }

  return (
    <motion.div
      className="text-center"
      style={{ overflow: "hidden" }}
      variants={containerVariants}
      initial="initial"
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
