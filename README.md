# Resale Market — demo frontend

React client for [market_fastapi](https://github.com/andreiyurik/market_fastapi), a
reservation and purchase API where every product exists in a single copy.

The layout follows the [resalemarket.ru](https://resalemarket.ru) storefront: a header with
the catalog button and search, a category row, promo banners and a product grid. No logo,
banners or product photos were copied: a text logo, gradients and icons are used instead. The
category row is visual only, because products in the API have no categories. The UI text is
in Russian on purpose, to match the original store.

The main goal of the demo is to show that when several buyers order the same product at the
same time, only one of them can reserve it.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com),
TanStack Query, [Hey API](https://heyapi.dev) (client generated from OpenAPI).

## Quick demo (Docker only)

One command starts PostgreSQL, the API and the frontend, and loads 16 demo products:

```bash
git clone https://github.com/andreiyurik/market_react
cd market_react
docker compose up --build
```

- App: http://localhost:5173
- Swagger: http://localhost:8000/docs
- OpenAPI: http://localhost:8000/openapi.json

The API image is built straight from the [market_fastapi](https://github.com/andreiyurik/market_fastapi)
repository on GitHub, so nothing else needs to be cloned or installed. Demo data is reset on
every start. If ports are taken, pick others: `WEB_PORT=8080 API_PORT=8001 docker compose up --build`.
Stop with `docker compose down`.

To test against a local backend checkout instead of GitHub:
`API_CONTEXT=../market_fastapi docker compose up --build`.

## Development setup

For working on the code with hot reload. Requires Node.js 24+, Docker and `make`. Clone both
repositories side by side:

```bash
git clone https://github.com/andreiyurik/market_fastapi
git clone https://github.com/andreiyurik/market_react
```

**1. Backend** (in `market_fastapi`):

```bash
make setup     # dependencies and .env
make up        # API + PostgreSQL in Docker, http://localhost:8000
make seed      # in another terminal: 16 demo products (wipes current data)
```

**2. Frontend** (in `market_react`):

```bash
npm install
npm run dev    # http://localhost:5173
```

By default the frontend talks to `http://localhost:8000`. Set another address in `.env`
(see `.env.example`): `VITE_API_URL=http://localhost:8080`. The backend already allows CORS
from `localhost:5173`.

## Demo walkthrough

1. **Catalog.** 16 products from `make seed`, all `AVAILABLE`. The header shows an
   "API онлайн" indicator and a Swagger link. The header search filters the catalog by title.
2. **Buy.** "Купить" → `POST /orders` → the status becomes `RESERVED`. Ordering the same
   product again fails with `409 Conflict`.
3. **Pay.** "Оплатить" → `POST /orders/{id}/pay` → the status becomes `SOLD`.
4. **Race.** "20 покупателей сразу" sends 20 concurrent `POST /orders` for one product.
   Result: 1 reservation, the other 19 get `409 Conflict`. The guarantee comes from
   PostgreSQL (an atomic conditional `UPDATE`), see the backend README for details.
5. **Sell to us.** The orange "Продать нам" banner opens a form → `POST /products`. A price of
   `-5` makes the backend return `422`.

To start over, run `make seed` in the backend and reload the page.

Browsers keep at most 6 concurrent connections per host, so the 20 requests go out in waves
of 6. That is enough for them to overlap. The backend test (`tests/test_concurrency.py`) checks
the same guarantee without this limit.

## API client

The code in `src/client/` is generated from the backend OpenAPI schema and is not edited by
hand. Every endpoint has a typed function and ready-made TanStack Query options:

```ts
const products = useQuery(productsListProductsOptions({ query: { limit: 100 } }))
const createOrder = useMutation(ordersCreateOrderMutation())
createOrder.mutate({ body: { product_id: product.id } })
```

After the backend API changes, regenerate the client with one command. By default the schema
is read from the sibling `../market_fastapi/openapi.json`, so the backend does not need to run:

```bash
npm run generate:api
OPENAPI_URL=http://localhost:8000/openapi.json npm run generate:api   # from a running server
```

The generator needs TypeScript 5 or 6; `@hey-api/openapi-ts` does not work with TypeScript 7
yet.

## Project structure

```
src/
├── main.tsx                   # QueryClient, toasts
├── App.tsx                    # page layout
├── client/                    # generated API client (do not edit)
├── components/
│   ├── ui/                    # shadcn/ui components (added with `npx shadcn add`)
│   ├── site-header.tsx        # header: catalog, search, API status, Swagger
│   ├── category-row.tsx       # category row (visual only)
│   ├── promo-banners.tsx      # race banner, "Продать нам", API link
│   ├── create-product-dialog.tsx  # "Продать нам" form
│   ├── product-list.tsx       # loading, search, empty state, errors
│   ├── product-card.tsx       # ordering, payment, race
│   └── status-badge.tsx
└── lib/
    ├── api.ts                 # API address, error messages
    ├── format.ts              # price formatting
    └── race.ts                # 20 concurrent orders
```

## Commands

| Command                 | What it does                           |
|-------------------------|----------------------------------------|
| `npm run dev`           | dev server with hot reload             |
| `npm run build`         | type check and production build        |
| `npm run lint`          | linter (oxlint)                        |
| `npm run generate:api`  | regenerate the API client from OpenAPI |
| `npx shadcn add <name>` | add a shadcn/ui component              |

CI (GitHub Actions) runs the linter and the build on every push and pull request.
