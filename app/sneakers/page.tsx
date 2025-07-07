"use client"

import React, { useState } from "react"

const tabs = ["Latest Drops", "Vintage Heat", "Running", "Basketball", "Skate"]

export default function SneakersPage() {
  const [activeTab, setActiveTab] = useState(0)
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Sneakers</h1>
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded font-semibold ${activeTab === i ? "bg-black text-white" : "bg-gray-200 text-black"}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border rounded-lg p-4">
          <div className="font-bold mb-2">Release Calendar</div>
          <div className="h-32 bg-gray-100 flex items-center justify-center mb-2">[Date + Model + Set Reminder]</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="font-bold mb-2">Authenticity Spotlight</div>
          <div className="h-32 bg-gray-100 flex items-center justify-center mb-2">[Carousel of legit-check tips]</div>
        </div>
        <div className="bg-white border rounded-lg p-4 md:col-span-2">
          <div className="font-bold mb-2">Top Trades Today</div>
          <div className="h-16 bg-gray-100 flex items-center justify-center mb-2">[Real-time feed]</div>
        </div>
      </div>
      {/* Banner Footnote */}
      <div className="p-4 bg-gray-100 text-gray-700 rounded text-center text-sm">
        Authenticity Guarantee on all sneakers valued &gt; 100 Credits.
      </div>
    </div>
  )
}
