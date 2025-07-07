"use client"

import React from "react"

export default function EcoThreadsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Eco-Threads Collection</h1>
      <p className="mb-8 text-lg text-gray-700">Discover unique, upcycled & sustainable pieces from top creators.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1,2,3,4,5,6,7,8].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg h-64 flex items-center justify-center text-gray-400">
            Image {i}
          </div>
        ))}
      </div>
    </div>
  )
}
