import { useQuery } from '@tanstack/react-query'
import { BookOpenIcon } from 'lucide-react'

import { healthHealthOptions } from '@/client/@tanstack/react-query.gen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { API_URL } from '@/lib/api'

export function AppHeader() {
  const health = useQuery({ ...healthHealthOptions(), refetchInterval: 5000, retry: false })

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Resale Market</h1>
        <p className="text-muted-foreground text-sm">
          Демо API резервирования: каждый товар существует в одном экземпляре
        </p>
      </div>
      <div className="flex items-center gap-3">
        {health.isSuccess ? (
          <Badge className="bg-emerald-600 text-white">API онлайн</Badge>
        ) : (
          <Badge variant="destructive">{health.isPending ? 'Проверка API…' : 'API недоступен'}</Badge>
        )}
        <Button variant="outline" size="sm" asChild>
          <a href={`${API_URL}/docs`} target="_blank" rel="noreferrer">
            <BookOpenIcon />
            Swagger
          </a>
        </Button>
      </div>
    </header>
  )
}
