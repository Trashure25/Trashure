const categories = [
  { title: "Bedding & Linens", items: ["Duvet covers", "Throw blankets"] },
  { title: "Desk & Storage", items: ["Shelving carts", "Organisers"] },
  { title: "Décor & Wall Art", items: ["Posters", "Tapestries", "Neon signs"] },
  { title: "Small Appliances", items: ["Mini-fridges", "Kettles"] },
  { title: "Eco-Upcycle Kits", items: ["Plant-dyed pillowcases", "Repair patches"] },
]

export default function HouseholdPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Households & Dorms</h1>
      {/* Category Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {categories.map((cat) => (
          <div key={cat.title} className="bg-white border rounded-lg p-4">
            <div className="font-bold mb-2">{cat.title}</div>
            <ul className="list-disc list-inside text-gray-700">
              {cat.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Banner */}
      <div className="mb-6 p-4 bg-yellow-100 text-yellow-900 rounded text-center font-semibold">
        Give your space a glow-up—without adding to landfill.
      </div>
      {/* CTA */}
      <div className="p-4 bg-green-100 text-green-900 rounded text-center font-semibold">
        Bundle & Ship → multi-item shipping discount explainer.
      </div>
    </div>
  )
}
