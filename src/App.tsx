import { useState } from 'react'

import { CategoryRow } from '@/components/category-row'
import { ProductList } from '@/components/product-list'
import { PromoBanners } from '@/components/promo-banners'
import { SiteHeader } from '@/components/site-header'

export default function App() {
  const [search, setSearch] = useState('')
  // productId -> orderId for orders created in this session: paying needs the order id.
  const [orders, setOrders] = useState<Record<string, string>>({})
  const handleOrdered = (productId: string, orderId: string) =>
    setOrders((current) => ({ ...current, [productId]: orderId }))

  return (
    <>
      <SiteHeader search={search} onSearchChange={setSearch} />
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-2 pb-16">
        <CategoryRow />
        <PromoBanners />
        <section id="catalog" className="grid scroll-mt-4 gap-4">
          <h2 className="font-heading text-2xl font-extrabold">Каталог</h2>
          <ProductList search={search} orders={orders} onOrdered={handleOrdered} />
        </section>
      </main>
    </>
  )
}
