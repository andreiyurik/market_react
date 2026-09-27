import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent, type ReactNode } from 'react'
import { toast } from 'sonner'

import { productsCreateProductMutation } from '@/client/@tanstack/react-query.gen'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { errorMessage } from '@/lib/api'

/** "Sell to us": creates a product via POST /products. `children` is the element that opens it. */
export function CreateProductDialog({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  const createProduct = useMutation({
    ...productsCreateProductMutation(),
    onSuccess: (product) => {
      toast.success(`Товар «${product.title}» выставлен на продажу`)
      setTitle('')
      setPrice('')
      setOpen(false)
      queryClient.invalidateQueries()
    },
    onError: (error) => toast.error(errorMessage(error)),
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createProduct.mutate({ body: { title, price } })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Продать нам</DialogTitle>
          <DialogDescription>Новый товар появится в каталоге со статусом «Доступен».</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Шуба норковая KALYAEV"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Цена, ₽</Label>
            <Input
              id="price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="21690"
              inputMode="decimal"
              required
            />
          </div>
          <Button type="submit" size="lg" className="rounded-xl" disabled={createProduct.isPending}>
            Выставить на продажу
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
