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
      <section className="w-full max-w-7xl mx-auto mb-20">
        <h2 className="text-4xl font-extrabold mb-12 text-gray-900 text-center tracking-tight uppercase">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { name: 'Menswear', href: '/menswear', img: '/placeholder.jpg' },
            { name: 'Womenswear', href: '/womenswear', img: '/placeholder.jpg' },
            { name: 'Sneakers', href: '/sneakers', img: '/placeholder.jpg' },
            { name: 'Designers', href: '/designers', img: '/placeholder.jpg' },
          ].map(cat => (
            <a
              key={cat.name}
              href={cat.href}
              className="relative group block w-full h-[340px] md:h-[420px] overflow-hidden"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute left-0 bottom-0 m-8 text-3xl md:text-4xl font-extrabold text-white uppercase drop-shadow-lg bg-black/40 px-6 py-3 rounded-none">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
