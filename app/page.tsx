"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

import { TrashureNavbar } from "@/components/trashure-navbar"
import { HeroCarousel } from "@/components/hero-carousel"
import { ItemGridSection } from "@/components/item-grid-section"
import { AnimatedSlogan } from "@/components/animated-slogan"
import type { Item } from "@/components/item-card"

function DigitalRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const letters = "TRASHURE010101".split("")
    const fontSize = 12
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)
    function renderFrame() {
      ctx.fillStyle = "rgba(255,255,255,0.04)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#059669"
      ctx.font = `${fontSize}px monospace`
      drops.forEach((y, idx) => {
        const text = letters[Math.floor(Math.random() * letters.length)]
        ctx.fillText(text, idx * fontSize, y * fontSize)
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[idx] = 0
        drops[idx]++
      })
    }
    const id = setInterval(renderFrame, 50)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    const cleanup = draw()
    window.addEventListener("resize", draw)
    return () => {
      cleanup?.()
      window.removeEventListener("resize", draw)
    }
  }, [draw])
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
}

const trendingApparelItems: Item[] = [
  {
    id: "1",
    name: "Organic Cotton Tee - Forest Green",
    brand: "EcoWear",
    price: "35 Credits",
    imageUrl: "/placeholder.svg?width=300&height=400",
    href: "/item/1",
  },
  {
    id: "2",
    name: "Recycled Denim Jeans - Light Wash",
    brand: "ReJean",
    price: "70 Credits",
    imageUrl: "/placeholder.svg?width=300&height=400",
    href: "/item/2",
  },
  {
    id: "3",
    name: "Hemp Blend Hoodie - Natural",
    brand: "EarthThreads",
    price: "60 Credits",
    imageUrl: "/placeholder.svg?width=300&height=400",
    href: "/item/3",
  },
  {
    id: "4",
    name: "Bamboo Fiber Trousers - Black",
    brand: "Sustainable Style",
    price: "55 Credits",
    imageUrl: "/placeholder.svg?width=300&height=400",
    href: "/item/4",
  },
  {
    id: "5",
    name: "Upcycled Silk Scarf - Floral",
    brand: "SecondBloom",
    price: "25 Credits",
    imageUrl: "/placeholder.svg?width=300&height=400",
    href: "/item/5",
  },
]

export default function HomePage() {
  const [animateContent, setAnimateContent] = useState(false)
  const delay = 0.5 // Declare the delay variable

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <TrashureNavbar />
      <AnimatedSlogan onSloganAnimationStart={() => setAnimateContent(true)} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animateContent ? 1 : 0 }}
        transition={{ duration: 1.0, ease: "circOut", delay: delay }}
        className="flex-grow"
      >
        <HeroCarousel />
        <ItemGridSection title="Trending Apparel" items={trendingApparelItems} />
      </motion.div>
      <DigitalRainCanvas />
    </div>
  )
}
