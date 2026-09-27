import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreditCardIcon, ShoppingCartIcon, UsersIcon } from 'lucide-react'
import { toast } from 'sonner'

import type { ProductRead } from '@/client'
import {
  ordersCreateOrderMutation,
  ordersPayOrderMutation,
} from '@/client/@tanstack/react-query.gen'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { errorMessage } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { raceOrders } from '@/lib/race'

const RACE_BUYERS = 20

type ProductCardProps = {
  product: ProductRead
  /** Order created for this product in the current browser session, needed to pay. */
  orderId?: string
  onOrdered: (productId: string, orderId: string) => void
}

export function ProductCard({ product, orderId, onOrdered }: ProductCardProps) {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries()

  const createOrder = useMutation({
    ...ordersCreateOrderMutation(),
    onSuccess: (order) => {
      onOrdered(product.id, order.id)
      toast.success(`«${product.title}» зарезервирован`)
    },
    onError: (error) => toast.error(errorMessage(error)),
    onSettled: refresh,
  })

  const payOrder = useMutation({
    ...ordersPayOrderMutation(),
    onSuccess: () => toast.success(`«${product.title}» оплачен и продан`),
    onError: (error) => toast.error(errorMessage(error)),
    onSettled: refresh,
  })

  const race = useMutation({
    mutationFn: () => raceOrders(product.id, RACE_BUYERS),
    onSuccess: (result) => {
      if (result.orderId) onOrdered(product.id, result.orderId)
      toast.info(`${result.buyers} покупателей одновременно`, {
        description: `Зарезервировал: ${result.succeeded}. Получили 409 Conflict: ${result.conflicted}.`,
      })
    },
    onError: (error) => toast.error(errorMessage(error)),
    onSettled: refresh,
  })

  const busy = createOrder.isPending || payOrder.isPending || race.isPending

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription className="text-foreground text-lg font-medium">
          {formatPrice(product.price)}
        </CardDescription>
        <CardAction>
          <StatusBadge status={product.status} />
        </CardAction>
      </CardHeader>
      <CardFooter className="mt-auto flex flex-wrap gap-2">
        {product.status === 'AVAILABLE' && (
          <>
            <Button
              size="sm"
              disabled={busy}
              onClick={() => createOrder.mutate({ body: { product_id: product.id } })}
            >
              <ShoppingCartIcon />
              Заказать
            </Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => race.mutate()}>
              <UsersIcon />
              {RACE_BUYERS} покупателей сразу
            </Button>
          </>
        )}
        {product.status === 'RESERVED' &&
          (orderId ? (
            <Button
              size="sm"
              disabled={busy}
              onClick={() => payOrder.mutate({ path: { order_id: orderId } })}
            >
              <CreditCardIcon />
              Оплатить
            </Button>
          ) : (
            <p className="text-muted-foreground text-sm">Заказ оформлен в другой сессии</p>
          ))}
        {product.status === 'SOLD' && (
          <p className="text-muted-foreground text-sm">Товар продан</p>
        )}
      </CardFooter>
    </Card>
  )
}
