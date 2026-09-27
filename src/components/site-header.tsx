import { useQuery } from '@tanstack/react-query'
import { BookOpenIcon, LayoutGridIcon, MapPinIcon, SearchIcon, ShoppingBagIcon } from 'lucide-react'

import { healthHealthOptions } from '@/client/@tanstack/react-query.gen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { API_URL } from '@/lib/api'

const TOP_LINKS = ['Мобильное приложение', 'Помощь', 'Доставка и оплата', 'Условия гарантии']

type SiteHeaderProps = {
  search: string
  onSearchChange: (search: string) => void
}

export function SiteHeader({ search, onSearchChange }: SiteHeaderProps) {
  const health = useQuery({ ...healthHealthOptions(), refetchInterval: 5000, retry: false })

  return (
    <header className="bg-background">
      <div className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs">
          <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1">
            <MapPinIcon className="size-3" />
            Москва
          </span>
          <nav className="hidden gap-6 md:flex">
            {TOP_LINKS.map((link) => (
              <span key={link}>{link}</span>
            ))}
          </nav>
          {health.isSuccess ? (
            <Badge className="bg-emerald-600 text-white">API онлайн</Badge>
          ) : (
            <Badge variant="destructive">{health.isPending ? 'Проверка API…' : 'API недоступен'}</Badge>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-5 lg:flex-nowrap">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-11 items-center justify-center rounded-full bg-linear-to-br from-orange-500 via-pink-500 to-primary text-white">
            <ShoppingBagIcon className="size-5" />
          </span>
          <span className="font-heading leading-none font-extrabold uppercase">
            <span className="block text-lg">Ресейл Маркет</span>
            <span className="block text-sm">Покупка продажа</span>
          </span>
        </a>

        <Button asChild size="lg" className="h-12 rounded-xl px-5">
          <a href="#catalog">
            <LayoutGridIcon />
            Каталог
          </a>
        </Button>

        <label className="border-primary flex h-12 min-w-0 flex-1 basis-full items-center rounded-xl border-2 pl-4 sm:basis-auto">
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="iPhone 16 Pro Max 256GB"
            className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          <span className="bg-primary text-primary-foreground flex h-full items-center rounded-r-lg px-4">
            <SearchIcon className="size-5" />
          </span>
        </label>

        <Button variant="outline" size="lg" className="h-12 rounded-xl" asChild>
          <a href={`${API_URL}/docs`} target="_blank" rel="noreferrer">
            <BookOpenIcon />
            Swagger
          </a>
        </Button>
      </div>
    </header>
  )
}
