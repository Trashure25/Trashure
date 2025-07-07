import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
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
        </CardContent>
      </Card>
    </Link>
  )
}
