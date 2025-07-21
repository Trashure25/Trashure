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
    name: "Nike Air Force 1 '07",
    price: 110,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Nike",
    size: "10",
    isNew: true,
  },
  {
    id: "2",
    name: "Adidas Stan Smith",
    price: 85,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Adidas",
    size: "9.5",
  },
  {
    id: "3",
    name: "New Balance 990v5",
    price: 185,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "New Balance",
    size: "11",
  },
  {
    id: "4",
    name: "Converse Chuck 70",
    price: 80,
    imageUrl: "/placeholder.svg?height=400&width=300",
    designer: "Converse",
    size: "10",
  },
]

export default function SneakersPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Sneakers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-bold mb-2">Sneakers</h1>
      <p className="text-gray-600 mb-8">From iconic classics to the latest drops, find your next pair here.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  )
}
