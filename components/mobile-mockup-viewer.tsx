"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Smartphone, Home, Shirt, PlusSquare, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface MockupScreen {
  id: string
  name: string
  description: string
  imageUrl: string
  icon: React.ReactNode
}

const screens: MockupScreen[] = [
  {
    id: "home",
    name: "Home Feed",
    description: "Discover new items and trending styles. Infinite scroll feed similar to popular fashion apps.",
    imageUrl: "/placeholder.svg?height=800&width=400",
    icon: <Home className="w-5 h-5" />,
  },
  {
    id: "item-details",
    name: "Item Details",
    description:
      "View detailed information about an item, including multiple images, description, size, condition, and suggested credit value. Options to 'Make Offer' or 'Add to Wishlist'.",
    imageUrl: "/placeholder.svg?height=800&width=400",
    icon: <Shirt className="w-5 h-5" />,
  },
  {
    id: "upload-item",
    name: "Upload Item",
    description:
      "Easily list your clothing. Guided steps for adding photos (front, back, details), brand, category, condition, and retail price. AI suggestions for tags and pricing.",
    imageUrl: "/placeholder.svg?height=800&width=400",
    icon: <PlusSquare className="w-5 h-5" />,
  },
  {
    id: "profile",
    name: "User Profile",
    description:
      "Manage your listings, view your credit balance, reputation score, past trades, and saved items. Edit your style preferences and personal information.",
    imageUrl: "/placeholder.svg?height=800&width=400",
    icon: <User className="w-5 h-5" />,
  },
  {
    id: "chat-negotiation",
    name: "Chat & Negotiation",
    description:
      "Real-time messaging to discuss trades. 'Offer Builder' tool to propose item swaps or credit adjustments. Securely finalize shipping details.",
    imageUrl: "/placeholder.svg?height=800&width=400",
    icon: <MessageSquare className="w-5 h-5" />,
  },
]

export default function MobileMockupViewer() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? screens.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === screens.length - 1 ? 0 : prevIndex + 1))
  }

  const currentScreen = screens[currentIndex]

  return (
    <div className="bg-black text-white py-12 px-4 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Trashure Mobile Experience</h2>
      <p className="text-lg text-gray-400 mb-8 text-center max-w-2xl">
        A glimpse into the intuitive and stylish interface of the Trashure mobile app.
      </p>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-5xl">
        <div className="w-full lg:w-1/3 space-y-2 mb-8 lg:mb-0">
          {screens.map((screen, index) => (
            <Button
              key={screen.id}
              variant={currentIndex === index ? "secondary" : "ghost"}
              className={`w-full justify-start text-left h-auto py-3 ${
                currentIndex === index
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`p-2 rounded-md ${currentIndex === index ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                  {screen.icon}
                </span>
                <div>
                  <p className="font-semibold">{screen.name}</p>
                  <p className={`text-xs ${currentIndex === index ? "text-purple-400" : "text-gray-500"}`}>
                    {screen.description.substring(0, 50)}...
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="relative w-full max-w-sm lg:w-2/3 flex flex-col items-center">
          <Card className="bg-gray-800 border-gray-700 shadow-2xl overflow-hidden w-[300px] h-[620px] md:w-[320px] md:h-[660px] rounded-[40px] p-3">
            <CardContent className="p-0 w-full h-full rounded-[30px] overflow-hidden relative">
              <Image
                src={currentScreen.imageUrl || "/placeholder.svg"}
                alt={currentScreen.name}
                width={400}
                height={800}
                className="object-cover w-full h-full"
              />
              {/* Notch and status bar simulation */}
              <div className="absolute top-0 left-0 right-0 h-8 px-4 flex items-center justify-between">
                <span className="text-xs text-white/80">9:41</span>
                <div className="absolute left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-lg"></div>
                <div className="flex items-center space-x-1">
                  <Smartphone className="w-3 h-3 text-white/80" />
                  <span className="text-xs text-white/80">LTE</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-6 text-center w-full max-w-md">
            <h3 className="text-xl font-semibold mb-1">{currentScreen.name}</h3>
            <p className="text-sm text-gray-400">{currentScreen.description}</p>
          </div>
          <div className="flex items-center justify-between w-full max-w-xs mt-4">
            <Button variant="outline" onClick={goToPrevious} className="border-gray-600 hover:bg-gray-700">
              <ChevronLeft className="w-5 h-5 mr-1" /> Prev
            </Button>
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {screens.length}
            </span>
            <Button variant="outline" onClick={goToNext} className="border-gray-600 hover:bg-gray-700">
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
