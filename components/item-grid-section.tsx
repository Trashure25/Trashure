import { ItemCard } from "./item-card"

interface Item {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  condition: string
  brand?: string
  size?: string
  userId: string
  status: string
  createdAt: string
  updatedAt: string
}

interface ItemGridSectionProps {
  title?: string
  subtitle?: string
  items?: Item[]
  className?: string
  loading?: boolean
  emptyMessage?: string
}

export function ItemGridSection({ title, subtitle, items = [], className, loading, emptyMessage }: ItemGridSectionProps) {
  if (loading) {
    return (
      <div className={`space-y-6 ${className || ""}`}>
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className={`space-y-6 ${className || ""}`}>
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
        <div className="text-center py-12">
          <p className="text-gray-500">{emptyMessage || "No items found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <ItemCard 
            key={item.id} 
            item={{
              id: item.id,
              name: item.title,
              price: item.price,
              imageUrl: item.images[0] || "/placeholder.svg",
              designer: item.brand || "Unknown",
              size: item.size || "N/A",
            }} 
          />
        ))}
      </div>
    </div>
  )
}
