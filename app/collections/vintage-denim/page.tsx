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
    name: "80s Acid Wash Jacket",
    price: 150,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Vintage Find",
    size: "M",
    isNew: true,
  },
  {
    id: "2",
    name: "Levi's 501 Original Fit",
    price: 90,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Levi's",
    size: "30/32",
  },
  {
    id: "3",
    name: "Distressed Denim Shorts",
    price: 65,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Vintage Find",
    size: "28",
  },
  {
    id: "4",
    name: "Wrangler Denim Shirt",
    price: 75,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Wrangler",
    size: "L",
  },
]

export default function VintageDenimPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Vintage Denim</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-2">Vintage Denim</h1>
      <p className="text-gray-600 mb-8">Timeless pieces with stories to tell.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}
