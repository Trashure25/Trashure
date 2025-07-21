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
    name: "Organic Cotton Tee",
    price: 45,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "EcoWear",
    size: "M",
    isNew: true,
  },
  {
    id: "2",
    name: "Recycled Denim Jacket",
    price: 120,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "ReJean",
    size: "L",
  },
  {
    id: "3",
    name: "Bamboo Fiber Scarf",
    price: 35,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "TerraThreads",
    size: "One Size",
  },
  {
    id: "4",
    name: "Hemp & Cotton Blend Trousers",
    price: 85,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "EcoWear",
    size: "32/32",
  },
]

export default function EcoThreadsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Eco-Threads</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-2">Eco-Threads</h1>
      <p className="text-gray-600 mb-8">Sustainable fashion that feels good and does good.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}
