import { ArrowUpRightIcon, BanknoteIcon, UsersIcon } from 'lucide-react'

import { CreateProductDialog } from '@/components/create-product-dialog'
import { API_URL } from '@/lib/api'

export function PromoBanners() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#f2706a] via-[#f652b6] to-[#b58df2] p-8 text-white sm:p-12">
        <h2 className="font-heading max-w-xl text-3xl font-extrabold sm:text-4xl">
          Каждый товар — в одном экземпляре
        </h2>
        <p className="mt-4 max-w-lg text-lg text-white/90">
          Нажмите «20 покупателей сразу» на любом товаре: 20 заказов уйдут одновременно, но
          купить сможет только один. Остальные получат <b>409 Conflict</b>.
        </p>
        <p className="font-heading mt-6 text-5xl font-extrabold sm:text-6xl">20 → 1</p>
        <UsersIcon className="absolute -right-6 -bottom-6 size-48 text-white/20 sm:size-64" />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <CreateProductDialog>
          <button className="relative min-h-40 overflow-hidden rounded-3xl bg-linear-to-br from-orange-400 to-orange-600 p-6 text-left text-white">
            <span className="font-heading block text-2xl font-extrabold">
              Продать
              <br />
              нам
            </span>
            <BanknoteIcon className="absolute -right-4 -bottom-4 size-28 text-white/30" />
          </button>
        </CreateProductDialog>

        <a
          href={`${API_URL}/docs`}
          target="_blank"
          rel="noreferrer"
          className="relative min-h-40 overflow-hidden rounded-3xl bg-linear-to-br from-fuchsia-500 to-primary p-6 text-white"
        >
          <span className="font-heading block text-2xl font-extrabold">API и Swagger</span>
          <span className="mt-12 inline-flex size-10 items-center justify-center rounded-full bg-white/20">
            <ArrowUpRightIcon className="size-5" />
          </span>
        </a>
      </div>
    </div>
  )
}
