"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AnimatedSlogan } from "@/components/animated-slogan"
import { HeroCarousel } from "@/components/hero-carousel"
import { ItemGridSection } from "@/components/item-grid-section"
import { UserListingsGrid } from "@/components/user-listings-grid"
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
  const [contentVisible, setContentVisible] = useState(false)

  return (
    <main className="min-h-screen bg-white">
      {!contentVisible && <AnimatedSlogan onAnimationComplete={() => setContentVisible(true)} />}

      {contentVisible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0, ease: "easeIn" }}>
          <HeroCarousel />
          <div className="py-8 md:py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black">
                Recently Listed by the Community
              </h2>
              <UserListingsGrid />
            </div>
          </div>
          <ItemGridSection
            title="Trending: Eco Threads"
            subtitle="VINTAGE, STREETWEAR, UPCYCLED BRANDS +MORE"
            items={trendingApparelItems}
          />
        </motion.div>
      )}
    </main>
  )
}
