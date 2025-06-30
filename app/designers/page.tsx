"use client"

export default function DesignersPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Designers</h1>
      {/* Add your designers content here, e.g. search bar, popular designers, etc. */}
      <div className="mb-6">
        <input className="w-full border rounded px-4 py-2" placeholder="Search 5 000+ brands..." />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Popular This Week</h2>
        <div className="flex gap-2 flex-wrap">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-full px-4 py-2 text-sm font-medium">Brand {i+1}</div>
          ))}
        </div>
      </div>
      {/* ...more designer content as needed... */}
    </div>
  )
}
