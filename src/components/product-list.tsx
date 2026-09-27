import { useQuery } from '@tanstack/react-query'

import { productsListProductsOptions } from '@/client/@tanstack/react-query.gen'
import { ProductCard } from '@/components/product-card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { errorMessage } from '@/lib/api'

const GRID = 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

type ProductListProps = {
  search: string
  orders: Record<string, string>
  onOrdered: (productId: string, orderId: string) => void
}

export function ProductList({ search, orders, onOrdered }: ProductListProps) {
  const products = useQuery(productsListProductsOptions({ query: { limit: 100 } }))

  if (products.isPending) {
    return (
      <div className={GRID}>
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="aspect-3/4 rounded-3xl" />
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
          Выставьте товар через «Продать нам» или загрузите демо-данные в бэкенде: `make seed`.
        </AlertDescription>
      </Alert>
    )
  }

  const query = search.trim().toLowerCase()
  const visible = products.data.filter((product) => product.title.toLowerCase().includes(query))

  if (visible.length === 0) {
    return <p className="text-muted-foreground">По запросу «{search}» ничего не найдено.</p>
  }

  return (
    <div className={GRID}>
      {visible.map((product) => (
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
