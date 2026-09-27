const priceFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

/** The API sends prices as decimal strings ("2500.00") to avoid float rounding. */
export function formatPrice(price: string): string {
  return priceFormat.format(Number(price))
}
