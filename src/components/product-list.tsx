import { useQuery } from '@tanstack/react-query'

import { productsListProductsOptions } from '@/client/@tanstack/react-query.gen'
import { ProductCard } from '@/components/product-card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { errorMessage } from '@/lib/api'

type ProductListProps = {
  orders: Record<string, string>
  onOrdered: (productId: string, orderId: string) => void
}

export function ProductList({ orders, onOrdered }: ProductListProps) {
  const products = useQuery(productsListProductsOptions({ query: { limit: 100 } }))

  if (products.isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
    )
  }

  if (products.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Не удалось загрузить товары</AlertTitle>
        <AlertDescription>
          {errorMessage(products.error)}. Запущен ли бэкенд (`make up`)?
        </AlertDescription>
      </Alert>
    )
  }

  if (products.data.length === 0) {
    return (
      <Alert>
        <AlertTitle>Товаров пока нет</AlertTitle>
        <AlertDescription>
          Создайте товар в форме или загрузите демо-данные в бэкенде: `make seed`.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {products.data.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          orderId={orders[product.id]}
          onOrdered={onOrdered}
        />
      ))}
    </div>
  )
}
