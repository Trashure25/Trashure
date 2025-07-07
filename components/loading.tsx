"use client"

import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-gray-500">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="text-sm">Loading…</span>
    </div>
  )
}
