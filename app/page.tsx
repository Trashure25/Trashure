"use client"

import { useState } from "react"
import { motion } from "framer-motion"

<<<<<<< HEAD
=======
import { UpdatedAuthNavbar } from "@/components/updated-auth-navbar"
>>>>>>> ea91cfa36fb5608b7e657f87b9d9845a081e4e99
import { HeroCarousel } from "@/components/hero-carousel"
import { ItemGridSection } from "@/components/item-grid-section"
import { AnimatedSlogan } from "@/components/animated-slogan"
import { PageTransition } from "@/components/page-transition"
<<<<<<< HEAD
=======
import { TrashureFooter } from "@/components/trashure-footer"
>>>>>>> ea91cfa36fb5608b7e657f87b9d9845a081e4e99
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
<<<<<<< HEAD
      <div className="bg-white text-black">
=======
      <div className="min-h-screen flex flex-col bg-white text-black">
        <UpdatedAuthNavbar />
>>>>>>> ea91cfa36fb5608b7e657f87b9d9845a081e4e99
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
<<<<<<< HEAD
=======
        <TrashureFooter />
>>>>>>> ea91cfa36fb5608b7e657f87b9d9845a081e4e99
      </div>
    </PageTransition>
  )
}
