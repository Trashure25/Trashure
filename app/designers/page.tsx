import React from "react"

export default function DesignersPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Designers</h1>
      {/* Search bar */}
      <div className="mb-6">
        <input className="w-full border rounded px-4 py-2" placeholder="Search 5 000+ brands..." autoFocus />
      </div>
      {/* Popular This Week */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Popular This Week</h2>
        <div className="flex gap-2 flex-wrap">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-full px-4 py-2 text-sm font-medium">Brand {i+1}</div>
          ))}
        </div>
      </div>
      {/* A-Z Index */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">A-Z Index</h2>
        <div className="flex gap-2 flex-wrap">
          {["Acne Studios", "Amiri", "Arc'teryx", "Yohji Yamamoto"].map((name, i) => (
            <div key={i} className="bg-gray-100 rounded px-3 py-1 text-sm">{name}</div>
          ))}
        </div>
      </div>
      {/* Trending Tags */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Trending Tags</h2>
        <div className="flex gap-2 flex-wrap">
          {["Gorpcore", "Quiet Luxury", "Y2K", "Techwear"].map((tag, i) => (
            <div key={i} className="bg-green-100 text-green-800 rounded px-3 py-1 text-sm">{tag}</div>
          ))}
        </div>
      </div>
      {/* See All Designers */}
      <div className="mb-8">
        <a href="#" className="text-primary font-semibold underline">See All Designers</a>
      </div>
      {/* Empty State */}
      <div className="mt-12 text-center text-gray-500 italic">No designer found. Try a broader term or explore <span className="text-primary">Trending Tags</span>.</div>
    </div>
  )
} 