"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: { [key: string]: FAQItem[] } = {
  "Trading": [
    {
      question: "How does trading work on Trashure?",
      answer: "Trading on Trashure allows you to exchange items with other users. When you find an item you want, you can make a trade offer by selecting one of your own items. The seller can then accept, decline, or counter your offer. Once both parties agree, you'll coordinate the exchange details."
    },
    {
      question: "Can I trade multiple items for one item?",
      answer: "Currently, our platform supports 1:1 trades (one item for one item). This keeps the trading process simple and fair for all users. We're working on multi-item trading features for the future."
    },
    {
      question: "What happens if a trade goes wrong?",
      answer: "If you encounter issues with a trade, contact our support team immediately. We recommend documenting the condition of items before shipping and using tracked shipping. Our trust score system helps identify reliable traders."
    },
    {
      question: "How do I know if someone is trustworthy to trade with?",
      answer: "Check their trust score and read reviews from previous trades. Users with higher trust scores have successfully completed more trades. You can also message the user to discuss the trade details before making an offer."
    }
  ],
  "Credits": [
    {
      question: "How do I purchase credits?",
      answer: "You can purchase credits by clicking the 'Purchase Credits' button in the top navigation. We offer various credit packages, and payments are processed securely through Stripe. Credits are added to your account immediately after purchase."
    },
    {
      question: "What can I use credits for?",
      answer: "Credits are used to purchase items on Trashure. Each item has a credit value, and you can buy items directly using your available credits. Credits are also used for premium features and listing promotions."
    },
    {
      question: "Can I get a refund for unused credits?",
      answer: "Credits are non-refundable once purchased. However, they never expire and can be used at any time. Make sure to review your purchase before confirming."
    },
    {
      question: "How do I check my credit balance?",
      answer: "Your current credit balance is displayed next to the 'Purchase Credits' button in the top navigation bar. You can also view your transaction history in your account settings."
    }
  ],
  "Account & Security": [
    {
      question: "How do I create an account?",
      answer: "Click the 'Sign Up' button and provide your email, username, and password. You'll need to verify your email address before you can start using the platform."
    },
    {
      question: "What is a trust score and how does it work?",
      answer: "Your trust score (starting at 70) reflects your reliability as a user. It increases with successful trades and credit purchases, and decreases if you receive reports. Higher trust scores give you access to more features and make other users more likely to trade with you."
    },
    {
      question: "How do I report a user?",
      answer: "If you encounter inappropriate behavior or fraudulent activity, you can report a user by clicking the 'Report User' button on their profile or listing. Provide detailed information about the issue, and our team will review it promptly."
    },
    {
      question: "Can I change my username?",
      answer: "Currently, usernames cannot be changed once created. Choose your username carefully as it will be your permanent identifier on the platform."
    }
  ],
  "Listings & Items": [
    {
      question: "How do I list an item for sale?",
      answer: "Click the 'List Item' button in the top navigation. Upload clear photos of your item, provide a detailed description, set your asking price in credits, and choose relevant categories. Your listing will be reviewed and published within 24 hours."
    },
    {
      question: "What types of items can I list?",
      answer: "You can list clothing, footwear, accessories, and household items. All items must be authentic, in good condition, and accurately described. We do not allow counterfeit items or items that violate our community guidelines."
    },
    {
      question: "How long do listings stay active?",
      answer: "Listings remain active for 30 days by default. You can renew them for free, or they will automatically expire. Sold items are automatically removed from the platform."
    },
    {
      question: "Can I edit my listing after posting?",
      answer: "Yes, you can edit your listing at any time before it sells. Go to 'My Listings' in your account to make changes to photos, descriptions, or pricing."
    }
  ]
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const toggleItem = (category: string, index: number) => {
    const key = `${category}-${index}`
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600">Find answers to common questions about Trashure</p>
      </div>

      <div className="space-y-8">
        {Object.entries(faqData).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => {
                const key = `${category}-${index}`
                const isOpen = openItems[key]
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 text-left font-medium hover:bg-gray-50"
                      onClick={() => toggleItem(category, index)}
                    >
                      {item.question}
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-gray-600">
                        {item.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Contact our support team.
            </p>
            <Button asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 