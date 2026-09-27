# Resale Market — демо-фронтенд

React-клиент для [market_fastapi](https://github.com/andreiyurik/market_fastapi): API
резервирования и покупки товаров, где каждый товар существует в одном экземпляре.

Главная задача демо — наглядно показать, что при одновременных заказах на один товар
зарезервировать его может только один покупатель.

**Стек:** React 19, TypeScript, Vite, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com),
TanStack Query, [Hey API](https://heyapi.dev) (клиент, сгенерированный из OpenAPI).

## Запуск

Нужны Node.js 24+, Docker и `make`. Репозитории лежат рядом:

```bash
git clone https://github.com/andreiyurik/market_fastapi
git clone https://github.com/andreiyurik/market_react
```

**1. Бэкенд** (в `market_fastapi`):

```bash
make setup     # зависимости и .env
make up        # API + PostgreSQL в Docker, http://localhost:8000
make seed      # в другом терминале: 8 демо-товаров (очищает текущие данные)
```

**2. Фронтенд** (в `market_react`):

```bash
npm install
npm run dev    # http://localhost:5173
```

По умолчанию фронтенд обращается к `http://localhost:8000`. Другой адрес задаётся в `.env`
(см. `.env.example`): `VITE_API_URL=http://localhost:8080`. Бэкенд уже разрешает CORS для
`localhost:5173`.

## Сценарий демо

1. **Каталог.** Товары из `make seed`, у каждого статус `AVAILABLE`. В шапке индикатор
   «API онлайн» и ссылка на Swagger.
2. **Заказ.** «Заказать» → `POST /orders` → статус становится `RESERVED`. Повторный заказ
   того же товара невозможен (`409 Conflict`).
3. **Оплата.** «Оплатить» → `POST /orders/{id}/pay` → статус `SOLD`.
4. **Гонка.** «20 покупателей сразу» одновременно отправляет 20 запросов `POST /orders` на
   один товар. Результат: зарезервировал 1, остальные 19 получили `409 Conflict`. Защита
   работает в PostgreSQL (атомарный условный `UPDATE`), подробности в README бэкенда.
5. **Валидация.** Создание товара с ценой `-5` → ошибка `422` от бэкенда.

Чтобы начать заново, выполните `make seed` в бэкенде и обновите страницу.

Браузер держит не больше 6 одновременных соединений с одним хостом, поэтому 20 запросов
уходят волнами по 6. Этого достаточно, чтобы запросы пересекались. Серверный тест бэкенда
(`tests/test_concurrency.py`) проверяет то же самое без этого ограничения.

## API-клиент

Код в `src/client/` сгенерирован из OpenAPI-схемы бэкенда и вручную не правится.
Для каждого эндпоинта есть типизированная функция и готовые опции для TanStack Query:

```ts
const products = useQuery(productsListProductsOptions({ query: { limit: 100 } }))
const createOrder = useMutation(ordersCreateOrderMutation())
createOrder.mutate({ body: { product_id: product.id } })
```

После изменения API на бэкенде клиент перегенерируется одной командой. По умолчанию схема
берётся из соседней папки `../market_fastapi/openapi.json`, бэкенд запускать не нужно:

```bash
npm run generate:api
OPENAPI_URL=http://localhost:8000/openapi.json npm run generate:api   # из запущенного сервера
```

Генератору нужен TypeScript 5 или 6: с TypeScript 7 `@hey-api/openapi-ts` пока не работает.

## Структура

```
src/
├── main.tsx                   # QueryClient, уведомления
├── App.tsx                    # раскладка страницы
├── client/                    # сгенерированный API-клиент (не править)
├── components/
│   ├── ui/                    # компоненты shadcn/ui (добавляются через `npx shadcn add`)
│   ├── app-header.tsx         # заголовок, статус API, ссылка на Swagger
│   ├── create-product-form.tsx
│   ├── product-list.tsx       # загрузка, пустое состояние, ошибки
│   ├── product-card.tsx       # заказ, оплата, гонка
│   └── status-badge.tsx
└── lib/
    ├── api.ts                 # адрес API, текст ошибок
    ├── format.ts              # формат цены
    └── race.ts                # 20 одновременных заказов
```

## Команды

| Команда                | Что делает                                 |
|------------------------|--------------------------------------------|
| `npm run dev`          | dev-сервер с hot reload                    |
| `npm run build`        | проверка типов и production-сборка         |
| `npm run lint`         | линтер (oxlint)                            |
| `npm run generate:api` | перегенерировать API-клиент из OpenAPI     |
| `npx shadcn add <имя>` | добавить компонент shadcn/ui               |

CI (GitHub Actions) на каждый push и pull request запускает линтер и сборку.
