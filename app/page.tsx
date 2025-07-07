"use client"

import { useState } from "react"
import { motion } from "framer-motion"

import { HeroCarousel } from "@/components/hero-carousel"
import { ItemGridSection } from "@/components/item-grid-section"
import { AnimatedSlogan } from "@/components/animated-slogan"
import { PageTransition } from "@/components/page-transition"
import type { Item } from "@/components/item-card"

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

  return (
    <PageTransition>
      <div className="bg-white text-black">
        <AnimatedSlogan onSloganAnimationStart={() => setAnimateContent(true)} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animateContent ? 1 : 0 }}
          transition={{ duration: 1.0, ease: "circOut", delay: 0.5 }}
          className="flex-grow"
        >
          <HeroCarousel />
          <ItemGridSection
            title="Trending: Sustainable Apparel"
            subtitle="VINTAGE, STREETWEAR, UPCYCLED BRANDS +MORE"
            items={trendingApparelItems}
          />
        </motion.div>
      </div>
    </PageTransition>
  )
}
