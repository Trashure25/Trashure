import React from "react"

export default function WomenswearPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Hero Copy */}
      <div className="w-full h-32 bg-pink-100 flex items-center justify-center mb-8">
        <span className="text-2xl font-bold">Curate your closet, sustainably.</span>
      </div>
      {/* Sticky Sub-Nav */}
      <nav className="sticky top-16 bg-white z-10 flex gap-6 border-b py-2 mb-8">
        {["Tops", "Bottoms", "Outerwear", "Dresses", "Co-ords", "Accessories"].map((cat) => (
          <a key={cat} href="#" className="font-semibold text-sm hover:text-primary">{cat}</a>
        ))}
      </nav>
      {/* Feed Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3].map((i) => (
          <div key={i} className="bg-white border rounded-lg p-4 flex flex-col">
            <div className="aspect-[3/4] bg-gray-100 mb-4 flex items-center justify-center">
              <span className="text-gray-400">3:4 Image</span>
            </div>
            <div className="mb-2 font-bold">Brand Name</div>
            <div className="mb-1">Item Name</div>
            <div className="mb-1 text-primary font-semibold">XX Credits</div>
            <div className="text-xs text-gray-500">Like icon</div>
          </div>
        ))}
      </div>
      {/* Fit-Finder Widget */}
      <div className="mt-8 p-4 bg-blue-100 text-blue-900 rounded text-center font-semibold">
        Fit-Finder Widget: Enter height + usual size → auto-filters.
      </div>
    </div>
  )
}
