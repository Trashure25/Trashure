"use client"

import { motion } from "framer-motion"
import { UserListingsGrid } from "@/components/user-listings-grid"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.0, ease: "easeIn" }}>
        <div className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black">
              Recently Listed by the Community
            </h2>
            <UserListingsGrid />
          </div>
        </div>
      </motion.div>
    </main>
  )
}
