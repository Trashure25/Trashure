"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"

interface ContactSellerModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  sellerName: string
}

export default function ContactSellerModal({ isOpen, onOpenChange, sellerName }: ContactSellerModalProps) {
  const { toast } = useToast()
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (message.trim().length < 10) {
      toast({
        title: "Message too short",
        description: "Please write a message of at least 10 characters.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would handle the messaging logic here.
    console.log(`Message for ${sellerName}: ${message}`)

    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${sellerName}.`,
    })
    onOpenChange(false)
    setMessage("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>Send a message to {sellerName} about this item.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Label htmlFor="message">Your Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message here. Ask about details, shipping, or anything else."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendMessage}>Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
