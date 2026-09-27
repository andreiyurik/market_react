import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreditCardIcon, FlameIcon, PackageIcon, ShoppingCartIcon, UsersIcon } from 'lucide-react'
import { toast } from 'sonner'

import type { ProductRead } from '@/client'
import {
  ordersCreateOrderMutation,
  ordersPayOrderMutation,
} from '@/client/@tanstack/react-query.gen'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { errorMessage } from '@/lib/api'
import { formatPrice } from '@/lib/format'
import { raceOrders } from '@/lib/race'

const RACE_BUYERS = 20

// The API has no product photos, so each card gets a soft placeholder background.
const PLACEHOLDERS = [
  'from-sky-100 to-indigo-200',
  'from-rose-100 to-orange-200',
  'from-emerald-100 to-teal-200',
  'from-violet-100 to-fuchsia-200',
  'from-amber-100 to-yellow-200',
]

function placeholderFor(id: string): string {
  const hash = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return PLACEHOLDERS[hash % PLACEHOLDERS.length]
}

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
    <article className="bg-card flex flex-col overflow-hidden rounded-3xl border">
      <div
        className={`relative flex aspect-4/3 items-center justify-center bg-linear-to-br ${placeholderFor(product.id)}`}
      >
        <PackageIcon className="size-16 text-black/15" />
        {product.status === 'AVAILABLE' && (
          <span className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-full bg-red-500 text-white">
            <FlameIcon className="size-4" />
          </span>
        )}
        <span className="absolute top-3 right-3">
          <StatusBadge status={product.status} />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="font-heading text-xl font-bold">{formatPrice(product.price)}</p>
          <h3 className="mt-1 line-clamp-2 text-sm">{product.title}</h3>
        </div>

        <div className="mt-auto grid gap-2">
          {product.status === 'AVAILABLE' && (
            <>
              <Button
                className="rounded-xl"
                disabled={busy}
                onClick={() => createOrder.mutate({ body: { product_id: product.id } })}
              >
                <ShoppingCartIcon />
                Купить
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={busy}
                onClick={() => race.mutate()}
              >
                <UsersIcon />
                {RACE_BUYERS} покупателей сразу
              </Button>
            </>
          )}
          {product.status === 'RESERVED' &&
            (orderId ? (
              <Button
                className="rounded-xl"
                disabled={busy}
                onClick={() => payOrder.mutate({ path: { order_id: orderId } })}
              >
                <CreditCardIcon />
                Оплатить
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm">Заказ оформлен в другой сессии</p>
            ))}
          {product.status === 'SOLD' && <p className="text-muted-foreground text-sm">Товар продан</p>}
        </div>
      </div>
    </article>
  )
}
