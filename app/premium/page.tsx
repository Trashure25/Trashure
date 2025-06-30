import React from "react"

export default function PremiumPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      {/* Landing Hero */}
      <div className="w-full h-40 bg-black flex items-center justify-center mb-8">
        <span className="text-3xl font-bold text-yellow-400">Premium</span>
      </div>
      {/* Tier Table */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-semibold mb-2">Premium Lite</div>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Access to rare listings (&lt; 5 made), no ads</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Premium</div>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>All Premium Lite perks</li>
              <li>Early access to drops</li>
              <li>Exclusive support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
