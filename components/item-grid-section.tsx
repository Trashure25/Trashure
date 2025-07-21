import { ItemCard, type Item } from "./item-card"

interface ItemGridSectionProps {
  title: string
  subtitle?: string
  items?: Item[]
  className?: string
}

export function ItemGridSection({ title, subtitle, items = [], className }: ItemGridSectionProps) {
  return (
    <section className={`py-6 md:py-10 ${className ?? ""}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        <h2 className="text-2xl md:text-3xl font-bold text-black">{title}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mt-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
