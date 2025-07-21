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
        You are an expert second-hand marketplace appraiser.
        Estimate a fair price for the item below in **credits**.
        10 credits equal 1 USD. The answer must be a whole number.

        Item:
        • Title: ${details.title}
        • Description: ${details.description}
        • Category: ${details.category}
        • Condition: ${details.condition}
        • Brand: ${details.brand || "N/A"}
      `,
    })

    return { success: true, price: object.priceInCredits }
  } catch (error) {
    console.error("AI price evaluation failed:", error)
    return {
      success: false,
      error: "Automatic price evaluation failed. Please enter the price manually.",
    }
  }
}
