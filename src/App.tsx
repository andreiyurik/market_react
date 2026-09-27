import { useState } from 'react'

import { AppHeader } from '@/components/app-header'
import { CreateProductForm } from '@/components/create-product-form'
import { ProductList } from '@/components/product-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function App() {
  // productId -> orderId for orders created in this session: paying needs the order id.
  const [orders, setOrders] = useState<Record<string, string>>({})
  const handleOrdered = (productId: string, orderId: string) =>
    setOrders((current) => ({ ...current, [productId]: orderId }))

  return (
    <div className="mx-auto grid max-w-6xl gap-6 p-4 sm:p-8">
      <AppHeader />
      <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="grid gap-6">
          <CreateProductForm />
          <Card>
            <CardHeader>
              <CardTitle>Как проверить гонку</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground grid gap-2 text-sm">
              <p>
                Кнопка «20 покупателей сразу» одновременно отправляет 20 запросов
                <code className="text-foreground"> POST /orders </code>на один товар.
              </p>
              <p>
                Зарезервировать должен ровно один, остальные получают <b>409 Conflict</b>.
                Защита работает на уровне PostgreSQL: атомарный условный UPDATE.
              </p>
            </CardContent>
          </Card>
        </aside>
        <main>
          <ProductList orders={orders} onOrdered={handleOrdered} />
        </main>
      </div>
    </div>
  )
}
