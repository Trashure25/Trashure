import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
<<<<<<< HEAD
import { Badge } from "@/components/ui/badge"

interface ItemCardProps {
  item: {
    id: string
    name: string
    price: number
    imageUrl: string
    designer: string
    size: string
    isNew?: boolean
  }
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/item/${item.id}`} className="group block">
      <Card className="w-full overflow-hidden border-0 bg-transparent shadow-none rounded-none">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {item.isNew && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                NEW
              </Badge>
            )}
          </div>
          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{item.designer}</p>
            <p className="font-semibold truncate">{item.name}</p>
            <p className="text-sm text-gray-700">Size {item.size}</p>
            <p className="font-bold">${item.price}</p>
          </div>
=======

export interface Item {
  id: string
  name: string
  price?: string // Or credit value
  imageUrl: string
  category?: string
  brand?: string
  href: string
}

export function ItemCard({ item }: { item: Item }) {
  return (
    <Link href={item.href} className="block group">
      <Card className="overflow-hidden border-gray-200 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="aspect-[3/4] relative w-full overflow-hidden">
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-3 flex flex-col flex-grow">
          {item.brand && <p className="text-xs text-gray-500 mb-0.5">{item.brand}</p>}
          <h3 className="text-sm font-medium text-black group-hover:text-primary truncate">{item.name}</h3>
          {item.price ? (
            <p className="text-sm font-semibold text-primary mt-1">{item.price}</p>
          ) : (
            <p className="text-sm font-semibold text-primary mt-1">Tradeable</p>
          )}
>>>>>>> ea91cfa36fb5608b7e657f87b9d9845a081e4e99
        </CardContent>
      </Card>
    </Link>
  )
}
