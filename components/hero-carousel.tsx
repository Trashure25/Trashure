"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const carouselItems = [
  {
    src: "/hero-images/hero-1.png",
    alt: "Abstract blurry photo of a field with yellow flowers",
    title: "Trending: Eco-Threads",
    subtitle: "Discover unique, upcycled & sustainable pieces.",
    buttonText: "Shop Eco-Threads",
    buttonLink: "/collections/eco-threads",
  },
  {
    src: "/hero-images/hero-2.png",
    alt: "Minimalist image of a grassy hill with colored squares",
    title: "Vintage Denim Drop",
    subtitle: "Rare finds and classic cuts.",
    buttonText: "Explore Denim",
    buttonLink: "/collections/vintage-denim",
  },
  {
    src: "/hero-images/hero-3.png",
    alt: "Painting of a desert landscape with a pinkish mesa",
    title: "Streetwear Essentials",
    subtitle: "Curated streetwear for the modern minimalist.",
    buttonText: "View Streetwear",
    buttonLink: "/collections/streetwear",
  },
]

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }))

  React.useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[220px] md:h-[320px]">
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.alt}
                  fill
                  className="object-cover brightness-75"
                  priority={index === 0}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/30 p-8">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold my-4">{item.title}</h2>
                  <p className="text-lg md:text-xl font-light tracking-wider uppercase">{item.subtitle}</p>
                  <Link
                    href={item.buttonLink}
                    className="inline-block mt-6 px-8 py-3 border border-white text-white rounded-md text-base hover:bg-white hover:text-black transition-colors"
                  >
                    {item.buttonText}
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white text-black" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white text-black" />
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 w-2 rounded-full ${current === index + 1 ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
