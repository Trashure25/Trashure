"use client"

import { useState } from "react"
import type { Listing } from "@/lib/listings"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

interface TradeOfferModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  userListings: Listing[]
  targetListing: Listing
}

export default function TradeOfferModal({ isOpen, onOpenChange, userListings, targetListing }: TradeOfferModalProps) {
  const { toast } = useToast()
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null)

  const handleSendOffer = () => {
    if (!selectedListingId) {
      toast({
        title: "No item selected",
        description: "Please select one of your items to trade.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would handle the trade offer logic here.
    // For example, send the offer to a backend service.
    console.log(`Trade offer made:
      Offering item ID: ${selectedListingId}
      For item ID: ${targetListing.id}`)

    toast({
      title: "Trade Offer Sent!",
      description: "The seller has been notified of your offer.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Make a Trade Offer</DialogTitle>
          <DialogDescription>Select one of your items to offer in trade for &quot;{targetListing.title}&quot;.</DialogDescription>
        </DialogHeader>

        {userListings.length > 0 ? (
          <ScrollArea className="h-72 my-4">
            <RadioGroup onValueChange={setSelectedListingId} className="space-y-4">
              {userListings.map((listing) => (
                <Label
                  key={listing.id}
                  htmlFor={listing.id}
                  className="flex items-center gap-4 p-4 border rounded-md has-[:checked]:border-primary"
                >
                  <RadioGroupItem value={listing.id} id={listing.id} />
                  <Image
                    src={listing.images[0] || "/placeholder.svg?width=64&height=64"}
                    alt={listing.title}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{listing.title}</span>
                    <span className="text-sm text-gray-500">{listing.price} Credits</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </ScrollArea>
        ) : (
          <div className="my-4 text-center text-gray-500 bg-gray-50 p-6 rounded-md">
            You have no active listings available to trade.
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendOffer} disabled={userListings.length === 0}>
            Send Trade Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
