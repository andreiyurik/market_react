import { ordersCreateOrder } from '@/client'

export type RaceResult = {
  buyers: number
  succeeded: number
  conflicted: number
  orderId?: string
}

/**
 * Sends `buyers` order requests for the same product at the same time.
 * The backend must let exactly one of them reserve the product (201), the rest get 409.
 */
export async function raceOrders(productId: string, buyers: number): Promise<RaceResult> {
  const results = await Promise.all(
    Array.from({ length: buyers }, () => ordersCreateOrder({ body: { product_id: productId } })),
  )
  const winners = results.filter((result) => result.response?.status === 201)
  return {
    buyers,
    succeeded: winners.length,
    conflicted: results.filter((result) => result.response?.status === 409).length,
    orderId: winners[0]?.data?.id,
  }
}
