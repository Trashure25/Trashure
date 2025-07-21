"use client"

import { ItemCard } from "@/components/item-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const items = [
  {
    id: "1",
    name: "Floral Midi Dress",
    price: 125,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Reformation",
    size: "S",
    isNew: true,
  },
  {
    id: "2",
    name: "High-Waisted Straight Jeans",
    price: 98,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "AGOLDE",
    size: "27",
  },
  {
    id: "3",
    name: "Silk Camisole",
    price: 60,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Vince",
    size: "M",
  },
  {
    id: "4",
    name: "Leather Ankle Boots",
    price: 195,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Madewell",
    size: "8",
  },
]

export default function WomenswearPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Womenswear</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-2">Womenswear</h1>
      <p className="text-gray-600 mb-8">
        Effortless style for every occasion, from everyday essentials to statement pieces.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}
