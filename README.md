# Astro on Cloudflare Workers (SSR)

A modern Astro project configured for Server-Side Rendering (SSR) and deployed as a **Cloudflare Worker** using the official `@astrojs/cloudflare` adapter and Wrangler.

---

## 🚀 Quick Start

### 1. Development Server
Run the local Astro development server:
```bash
npm run dev
```

### 2. Type Checking & Worker Types
Generate TypeScript definitions for your Cloudflare bindings and validate your Astro components:
```bash
# Generate types for bindings defined in wrangler.jsonc / .dev.vars
npm run generate-types

# Run Astro TypeScript diagnostics
npm run check
```

### 3. Production Build & Local Preview
Build the project for Cloudflare Workers and preview it locally using the actual Cloudflare `workerd` runtime:
```bash
# Build server entrypoints and static assets to ./dist
npm run build

# Preview locally with Cloudflare's runtime
npm run preview
```

### 4. Deploy to Cloudflare
Deploy your Worker and static assets directly to Cloudflare:
```bash
npm run deploy
```
*(Requires being authenticated with Cloudflare via `npx wrangler login` or setting `CLOUDFLARE_API_TOKEN`)*

---

## 📁 Project Structure

```text
├── .dev.vars                   # Local secret environment variables (ignored by git)
├── astro.config.mjs            # Astro configuration (output: 'server', cloudflare adapter)
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript config with Astro & Worker types
├── worker-configuration.d.ts   # Auto-generated Cloudflare environment types
├── wrangler.jsonc              # Cloudflare Worker configuration & resource bindings
├── public/                     # Static assets (favicons, images, robots.txt)
└── src/
    └── pages/
        ├── index.astro         # SSR Home page with live runtime metadata
        └── api/
            └── health.ts       # On-demand JSON API endpoint with CF request data
```

---

## ⚙️ Configuration Details

### `astro.config.mjs`
Configured with `output: 'server'` so all routes are server-rendered on-demand by default. If you have static pages that don't need runtime processing, add `export const prerender = true;` at the top of the `.astro` file.

```javascript
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
});
```

### `wrangler.jsonc`
Defines Cloudflare Worker parameters:
- `main`: Points to `@astrojs/cloudflare/entrypoints/server`
- `compatibility_flags`: Includes `nodejs_compat` for Node.js API compatibility
- `assets`: Routes static files from `./dist`
- `vars`: Application environment variables (e.g. `ENVIRONMENT`)

---

## 🧩 Accessing Cloudflare Runtime Features

### 1. Request Metadata (`Astro.request.cf`)
Cloudflare provides edge metadata with incoming requests, such as the user's location and edge data center (colo):

```astro
---
const cf = Astro.request.cf;
const country = cf?.country;
const colo = cf?.colo;
---
<p>Request served from colo {colo} to {country}</p>
```

### 2. Environment Variables & Bindings (`cloudflare:workers`)
Access bindings and variables type-safely:

```astro
---
import { env } from 'cloudflare:workers';

const environment = env.ENVIRONMENT;
---
<p>Current Environment: {environment}</p>
```

### 3. Adding Cloudflare Resources (KV, D1, R2)
Uncomment or add resource blocks to [wrangler.jsonc](file:///Users/jan/Library/Mobile%20Documents/com~apple~CloudDocs/File%20Cabinet/Work/Projects/SSR-test/wrangler.jsonc):

```jsonc
// Example: Cloudflare KV
"kv_namespaces": [
  { "binding": "MY_KV", "id": "<KV_NAMESPACE_ID>" }
]
```
After updating `wrangler.jsonc`, run `npm run generate-types` to automatically refresh TypeScript definitions in `worker-configuration.d.ts`.
