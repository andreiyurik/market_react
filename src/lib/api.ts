import { client } from '@/client/client.gen'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

client.setConfig({ baseUrl: API_URL })

/** Turns a backend error (`{"detail": ...}`) or a network failure into a readable message. */
export function errorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'detail' in error) {
    const { detail } = error as { detail: unknown }
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) return detail.map((item) => item.msg).join('; ')
  }
  if (error instanceof Error) return error.message
  return 'Неизвестная ошибка'
}
