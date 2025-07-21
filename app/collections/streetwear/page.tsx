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
    name: "Graphic Print Hoodie",
    price: 95,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "UrbanFlow",
    size: "L",
    isNew: true,
  },
  {
    id: "2",
    name: "Cargo Utility Pants",
    price: 110,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Concrete Co.",
    size: "M",
  },
  {
    id: "3",
    name: "Oversized Boxy Tee",
    price: 50,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "UrbanFlow",
    size: "XL",
  },
  {
    id: "4",
    name: "High-Top Canvas Sneakers",
    price: 130,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Concrete Co.",
    size: "10",
  },
]

export default function StreetwearPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Streetwear</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-2">Streetwear</h1>
      <p className="text-gray-600 mb-8">Curated looks from the concrete jungle.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}
