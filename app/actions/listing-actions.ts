"use server"

import { z } from "zod"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"

/**
 * 10 credits = 1 USD
 * The function tries to ask GPT-4o for an estimated market value.
 * If the OPENAI_API_KEY is not present it immediately returns
 * `success: false` so the client component can fall back to
 * a manual-price flow.
 */
export async function evaluateItemPrice(details: {
  title: string
  description: string
  category: string
  condition: string
  brand?: string
}) {
  // ---- safeguard: no key, skip AI completely ----
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: "Automatic price evaluation is unavailable (missing OpenAI key). Please enter the price manually.",
    }
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        /** Whole-number price in credits (10 credits = 1 USD). */
        priceInCredits: z.number().int().positive(),
      }),
      prompt: `
        You are an expert second-hand marketplace appraiser specializing in luxury fashion, streetwear, and designer items.
        
        IMPORTANT: Search online for the current market price and MSRP of this specific item, then provide a realistic second-hand price.
        
        Estimate a fair market price for the item below in **credits**.
        10 credits equal 1 USD. The answer must be a whole number.
        
        PRICING METHODOLOGY:
        1. Search online for the current retail price (MSRP) of this specific item
        2. Check current resale market prices on platforms like Grailed, StockX, eBay, etc.
        3. Apply condition-based discount: New with tags = 70-85% of retail, Like new = 60-75%, Good = 40-60%, Fair = 25-40%, Poor = 10-25%
        4. Consider brand prestige, rarity, and current market demand
        5. Factor in that this is a second-hand marketplace (prices should be below retail)
        
        EXAMPLE: A new Dior t-shirt typically retails for $800-1200, so a "New with tags" condition should be 5600-10200 credits ($560-1020).
        
        Item to evaluate:
        • Title: ${details.title}
        • Description: ${details.description}
        • Category: ${details.category}
        • Condition: ${details.condition}
        • Brand: ${details.brand || "N/A"}
        
        Search for current market prices and provide a realistic second-hand price in credits (10 credits = $1 USD).
      `,
    })

    return { success: true, price: Math.ceil(object.priceInCredits * 1.05) }
  } catch (error) {
    console.error("AI price evaluation failed:", error)
    return {
      success: false,
      error: "Automatic price evaluation failed. Please enter the price manually.",
    }
  }
}
