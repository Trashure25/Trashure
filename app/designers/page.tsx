"use client"
import { AvatarUploader } from "./components/AvatarUploader"
import { ProfileStats } from "./components/ProfileStats"
import { Reputation } from "./components/Reputation"
import { StyleFit } from "./components/StyleFit"
import { InventoryCarousel } from "./components/InventoryCarousel"
import { Wallet } from "./components/Wallet"
import { Sustainability } from "./components/Sustainability"
import { Shipping } from "./components/Shipping"
import { Social } from "./components/Social"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <AvatarUploader />
          <ProfileStats />
          <Reputation />
          <StyleFit />
          <InventoryCarousel />
        </div>
        <div>
          <Wallet />
          <Sustainability />
          <Shipping />
          <Social />
        </div>
      </div>
    </div>
  )
} 