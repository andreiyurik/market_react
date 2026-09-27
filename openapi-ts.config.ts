import { defineConfig } from '@hey-api/openapi-ts'

// The backend commits its OpenAPI schema, so the client can be generated without running it.
// Override with OPENAPI_URL, e.g. OPENAPI_URL=http://localhost:8000/openapi.json npm run generate:api
export default defineConfig({
  input:
    process.env.OPENAPI_URL ??
    'https://raw.githubusercontent.com/andreiyurik/market_fastapi/main/openapi.json',
  output: 'src/client',
  plugins: ['@hey-api/client-fetch', '@tanstack/react-query'],
})
