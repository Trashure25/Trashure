import { Skeleton } from "@/components/ui/skeleton"
import { TrashureFooter } from "@/components/trashure-footer"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 border rounded-lg bg-white">
              <Skeleton className="h-10 w-1/3 mx-auto mb-2" />
              <Skeleton className="h-6 w-1/4 mx-auto mb-6" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </main>
      <TrashureFooter />
    </div>
  )
}
