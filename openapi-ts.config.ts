import { defineConfig } from '@hey-api/openapi-ts'

// The backend commits its OpenAPI schema, so the client is generated from the sibling
// market_fastapi checkout without running the backend. Override with OPENAPI_URL, e.g.
// OPENAPI_URL=http://localhost:8000/openapi.json npm run generate:api
export default defineConfig({
  input: process.env.OPENAPI_URL ?? '../market_fastapi/openapi.json',
  output: 'src/client',
  plugins: [
    // The API address is set at runtime from VITE_API_URL (src/lib/api.ts),
    // so don't bake in the host the schema was downloaded from.
    { name: '@hey-api/client-fetch', baseUrl: false },
    '@tanstack/react-query',
  ],
})
