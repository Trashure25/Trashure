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
    name: "Classic Oxford Shirt",
    price: 75,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Brooks Brothers",
    size: "M",
    isNew: true,
  },
  {
    id: "2",
    name: "Slim-Fit Chinos",
    price: 80,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "J.Crew",
    size: "32/32",
  },
  {
    id: "3",
    name: "Merino Wool Sweater",
    price: 120,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Everlane",
    size: "L",
  },
  {
    id: "4",
    name: "Leather Brogues",
    price: 250,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Allen Edmonds",
    size: "10.5",
  },
]

export default function MenswearPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Menswear</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-2">Menswear</h1>
      <p className="text-gray-600 mb-8">Timeless styles and modern essentials for the discerning gentleman.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}
