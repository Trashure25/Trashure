"use client"

import * as React from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

interface CarouselSlide {
  id: number
  imageSrc: string
  altText: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
}

const slides: CarouselSlide[] = [
  {
    id: 1,
    imageSrc: "/placeholder.svg?width=1200&height=400",
    altText: "Trending Sustainable Fashion",
    title: "Trending: Eco-Threads",
    subtitle: "Discover unique, upcycled & sustainable pieces from top creators.",
    buttonText: "Shop Eco-Threads",
    buttonLink: "/collections/eco-threads",
  },
  {
    id: 2,
    imageSrc: "/placeholder.svg?width=1200&height=400",
    altText: "Vintage Denim Collection",
    title: "Vintage Denim Drop",
    subtitle: "Rare finds and classic cuts. Your next favorite jeans are here.",
    buttonText: "Explore Denim",
    buttonLink: "/collections/vintage-denim",
  },
  {
    id: 3,
    imageSrc: "/placeholder.svg?width=1200&height=400",
    altText: "Minimalist Streetwear",
    title: "Streetwear Essentials",
    subtitle: "Curated streetwear for the modern minimalist. Trade for your next look.",
    buttonText: "View Streetwear",
    buttonLink: "/collections/streetwear",
  },
]

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

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
    <div className="w-full relative">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative h-[300px] md:h-[350px] lg:h-[400px] w-full">
                {" "}
                {/* Reduced height */}
                <Image
                  src={slide.imageSrc || "/placeholder.svg"}
                  alt={slide.altText}
                  layout="fill"
                  objectFit="cover"
                  className="brightness-75"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/30 p-8">
                  <p className="text-sm md:text-base font-light tracking-wider uppercase">{slide.subtitle}</p>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold my-4">{slide.title}</h2>
                  <a
                    href={slide.buttonLink}
                    className="inline-flex items-center justify-center mt-4 px-8 py-3 text-base md:text-lg border border-white text-white hover:bg-white hover:text-black rounded-md transition-colors"
                  >
                    {slide.buttonText}
                  </a>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white text-black" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white text-black" />
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
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
