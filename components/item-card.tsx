import React from "react"
import Link from "next/link"

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

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <Link
      href={`/listing/${item.id}`}
      className="card group relative flex flex-col items-stretch p-0 overflow-hidden transition-transform duration-200 ease-in-out hover:scale-[1.025] hover:shadow-2xl focus-within:scale-[1.025] focus-within:shadow-2xl cursor-pointer"
      tabIndex={0}
      aria-label={item.name}
    >
      <div className="relative w-full aspect-square bg-[#f5f5f5] flex items-center justify-center overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105 group-focus:scale-105 rounded-t-2xl"
          loading="lazy"
        />
        {item.isNew && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">New</span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4 bg-white rounded-b-2xl">
        <div className="flex items-center justify-between mb-1">
          <span className="text-lg font-bold text-gray-900">${item.price}</span>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{item.size}</span>
        </div>
        <div className="text-base font-semibold text-gray-900 truncate" title={item.name}>{item.name}</div>
        <div className="text-sm text-gray-500 truncate" title={item.designer}>{item.designer}</div>
      </div>
    </Link>
  )
}
