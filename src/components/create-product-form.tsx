import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import { productsCreateProductMutation } from '@/client/@tanstack/react-query.gen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { errorMessage } from '@/lib/api'

export function CreateProductForm() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')

  const createProduct = useMutation({
    ...productsCreateProductMutation(),
    onSuccess: (product) => {
      toast.success(`Товар «${product.title}» создан`)
      setTitle('')
      setPrice('')
      queryClient.invalidateQueries()
    },
    onError: (error) => toast.error(errorMessage(error)),
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createProduct.mutate({ body: { title, price } })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Новый товар</CardTitle>
        <CardDescription>POST /products</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Leica M6"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Цена, ₽</Label>
            <Input
              id="price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="2500.00"
              inputMode="decimal"
              required
            />
          </div>
          <Button type="submit" disabled={createProduct.isPending}>
            Создать
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
