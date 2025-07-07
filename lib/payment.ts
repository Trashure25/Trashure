/**
 * Return the user’s cart from localStorage.
 * Falls back to an empty array on the server or if nothing is stored.
 */
function loadCart(userId: string): any[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(`trashure_cart_${userId}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const payment = {
  getCreditPackages: () => {
    return [
      { dollars: 5, credits: 50, bonus: 0, popular: false },
      { dollars: 10, credits: 100, bonus: 10, popular: true },
      { dollars: 25, credits: 250, bonus: 50, popular: false },
      { dollars: 50, credits: 500, bonus: 125, popular: false },
      { dollars: 100, credits: 1000, bonus: 300, popular: false },
    ]
  },
  getCart: (userId: string) => loadCart(userId),
}
