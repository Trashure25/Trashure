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
      <section className="w-full max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center tracking-tight drop-shadow-lg">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: 'Menswear', href: '/menswear', img: '/placeholder.jpg' },
            { name: 'Womenswear', href: '/womenswear', img: '/placeholder.jpg' },
            { name: 'Sneakers', href: '/sneakers', img: '/placeholder.jpg' },
            { name: 'Designers', href: '/designers', img: '/placeholder.jpg' },
          ].map(cat => (
            <a
              key={cat.name}
              href={cat.href}
              className="group block rounded-3xl overflow-hidden shadow-2xl bg-white/70 backdrop-blur-lg border border-gray-200 hover:shadow-3xl hover:-translate-y-1 transition-all duration-200"
              style={{ minHeight: 260 }}
            >
              <div className="aspect-square w-full bg-gradient-to-tr from-[#f5f5f5] to-[#e5e5e5] flex items-center justify-center overflow-hidden relative">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200 rounded-t-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70 group-hover:opacity-80 transition-opacity" />
              </div>
              <div className="p-6 text-center flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-900 group-hover:text-accent transition-colors drop-shadow-md tracking-wide">
                  {cat.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
