"use client"

import { motion } from "framer-motion"
import { UserListingsGrid } from "@/components/user-listings-grid"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#f5f5f5] to-[#e5e5e5] flex flex-col items-center justify-start pt-20 pb-12">
      {/* Hero Section */}
      <section className="w-full max-w-3xl mx-auto text-center mb-16 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
          Discover, Trade, and Elevate Your Wardrobe
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 font-medium">
          The modern marketplace for curated fashion, streetwear, and home essentials.
        </p>
        <a href="/list-item">
          <button className="bg-accent text-white text-lg font-bold rounded-full px-8 py-4 shadow-lg hover:bg-[#009e7a] transition-all">
            List Your First Item
          </button>
        </a>
      </section>

      {/* Featured Categories */}
      <section className="w-full max-w-5xl mx-auto mb-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: 'Menswear', href: '/menswear', img: '/placeholder.jpg' },
            { name: 'Womenswear', href: '/womenswear', img: '/placeholder.jpg' },
            { name: 'Sneakers', href: '/sneakers', img: '/placeholder.jpg' },
            { name: 'Designers', href: '/designers', img: '/placeholder.jpg' },
          ].map(cat => (
            <a key={cat.name} href={cat.href} className="group block rounded-2xl overflow-hidden shadow-xl bg-white hover:shadow-2xl transition-all">
              <div className="aspect-square w-full bg-[#f5f5f5] flex items-center justify-center overflow-hidden">
                <img src={cat.img} alt={cat.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200" />
              </div>
              <div className="p-4 text-center">
                <span className="text-lg font-bold text-gray-900 group-hover:text-accent transition-colors">{cat.name}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
