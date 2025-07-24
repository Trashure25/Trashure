"use client"

import { HeroCarousel } from "@/components/hero-carousel"
import { AnimatedSlogan } from "@/components/animated-slogan"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#f5f5f5] to-[#e5e5e5] flex flex-col items-center justify-start pt-0 pb-12">
      {/* Animated Slogan */}
      <div className="w-full flex flex-col items-center mt-8 mb-2">
        <AnimatedSlogan />
      </div>
      {/* Hero Carousel */}
      <section className="w-full max-w-5xl mx-auto mb-16 animate-fade-in">
        <HeroCarousel />
      </section>

      {/* Featured Categories */}
      <section className="w-full max-w-5xl mx-auto mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center tracking-tight uppercase">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Menswear', href: '/menswear', img: '/placeholder.jpg' },
            { name: 'Womenswear', href: '/womenswear', img: '/placeholder.jpg' },
            { name: 'Sneakers', href: '/sneakers', img: '/placeholder.jpg' },
            { name: 'Designers', href: '/designers', img: '/placeholder.jpg' },
          ].map(cat => (
            <a
              key={cat.name}
              href={cat.href}
              className="relative group block w-full h-[120px] md:h-[160px] overflow-hidden"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute left-0 bottom-0 m-3 text-base md:text-lg font-semibold text-white uppercase drop-shadow bg-black/50 px-3 py-1 rounded-none tracking-wide">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
