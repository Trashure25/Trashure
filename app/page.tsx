"use client"

import { HeroCarousel } from "@/components/hero-carousel"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#f5f5f5] to-[#e5e5e5] flex flex-col items-center justify-start pt-0 pb-12">
      {/* Slogan Bar */}
      <div className="w-full flex justify-center mb-4">
        <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#06402B]">We make your trash treasure</span>
      </div>
      {/* Hero Carousel */}
      <section className="w-full max-w-5xl mx-auto mb-16 animate-fade-in">
        <HeroCarousel />
      </section>

      {/* Featured Sections (Grailed style) */}
      <section className="w-full max-w-6xl mx-auto mb-10 px-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Trending: Apparel */}
          <div>
            <div className="text-xs uppercase text-gray-400 mb-1">Vintage, Streetwear, Supreme +more</div>
            <div className="text-lg font-bold mb-2 text-black">Trending: Apparel</div>
            <div className="grid grid-cols-2 gap-2">
              {[1,2,3,4].map((i, idx) => (
                <div key={i} className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  <img src="/placeholder.jpg" alt="Apparel" className="object-cover w-full h-full" />
                  {idx === 3 && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-mono uppercase tracking-wider">+ View More</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Trending: Footwear */}
          <div>
            <div className="text-xs uppercase text-gray-400 mb-1">Jordan Brand, Nike, Maison Margiela +more</div>
            <div className="text-lg font-bold mb-2 text-black">Trending: Footwear</div>
            <div className="grid grid-cols-2 gap-2">
              {[1,2,3,4].map((i, idx) => (
                <div key={i} className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  <img src="/placeholder.jpg" alt="Footwear" className="object-cover w-full h-full" />
                  {idx === 3 && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-mono uppercase tracking-wider">+ View More</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Trending: Accessories */}
          <div>
            <div className="text-xs uppercase text-gray-400 mb-1">Supreme, Vintage, Chrome Hearts +more</div>
            <div className="text-lg font-bold mb-2 text-black">Trending: Accessories</div>
            <div className="grid grid-cols-2 gap-2">
              {[1,2,3,4].map((i, idx) => (
                <div key={i} className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  <img src="/placeholder.jpg" alt="Accessories" className="object-cover w-full h-full" />
                  {idx === 3 && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-mono uppercase tracking-wider">+ View More</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
