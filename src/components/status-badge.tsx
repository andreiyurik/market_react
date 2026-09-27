import type { ProductStatus } from '@/client'
import { Badge } from '@/components/ui/badge'

const STATUSES: Record<ProductStatus, { label: string; className: string }> = {
  AVAILABLE: { label: 'Доступен', className: 'bg-emerald-600 text-white' },
  RESERVED: { label: 'Зарезервирован', className: 'bg-amber-500 text-white' },
  SOLD: { label: 'Продан', className: 'bg-muted text-muted-foreground' },
}

export function StatusBadge({ status }: { status: ProductStatus }) {
  const { label, className } = STATUSES[status]
  return <Badge className={className}>{label}</Badge>
}
