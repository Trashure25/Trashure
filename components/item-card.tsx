import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

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
        </CardContent>
      </Card>
    </Link>
  )
}
