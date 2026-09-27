import {
  BabyIcon,
  GemIcon,
  MicrowaveIcon,
  PercentIcon,
  ShirtIcon,
  ShoppingBagIcon,
  SmartphoneIcon,
  WatchIcon,
  type LucideIcon,
} from 'lucide-react'

const CATEGORIES: { name: string; icon: LucideIcon; className: string }[] = [
  { name: 'Акции', icon: PercentIcon, className: 'bg-red-100 text-red-500' },
  { name: 'Электроника и техника', icon: SmartphoneIcon, className: 'bg-sky-100 text-sky-600' },
  { name: 'Меховые изделия', icon: ShirtIcon, className: 'bg-violet-100 text-violet-600' },
  { name: 'Ювелирные украшения', icon: GemIcon, className: 'bg-emerald-100 text-emerald-600' },
  { name: 'Бытовая техника', icon: MicrowaveIcon, className: 'bg-slate-100 text-slate-600' },
  { name: 'Часы', icon: WatchIcon, className: 'bg-rose-100 text-rose-500' },
  { name: 'Детские товары', icon: BabyIcon, className: 'bg-amber-100 text-amber-600' },
  { name: 'Аксессуары', icon: ShoppingBagIcon, className: 'bg-pink-100 text-pink-500' },
]

/** Store categories. Visual only: the demo API has no product categories. */
export function CategoryRow() {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 [scrollbar-width:none] lg:justify-between">
      {CATEGORIES.map(({ name, icon: Icon, className }) => (
        <div key={name} className="flex w-28 shrink-0 flex-col items-center gap-2 text-center">
          <span className={`flex size-20 items-center justify-center rounded-full ${className}`}>
            <Icon className="size-9" />
          </span>
          <span className={`text-xs sm:text-sm ${name === 'Акции' ? 'font-medium text-red-500' : ''}`}>
            {name}
          </span>
        </div>
      ))}
    </div>
  )
}
