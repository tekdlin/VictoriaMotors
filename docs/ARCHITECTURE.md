# Victoria Motors – Architecture

## Overview

The app is split into **backend** (server + API), **frontend** (UI + API client), and **shared** (types, validation, constants).

## Directory Structure

```
src/
├── app/                    # Next.js App Router – routes and page composition only
│   ├── (admin)/            # Admin layout and pages
│   ├── (auth)/             # Login, register
│   ├── (portal)/           # Customer portal layout and pages
│   └── api/                # HTTP API – thin handlers that call server services
│       ├── auth/
│       ├── me/             # Current customer: profile, payments, invoices, documents
│       ├── admin/          # Admin: stats, customers
│       └── stripe/         # Stripe: checkout, portal, topup, webhook
├── server/                 # Backend – data access and business logic
│   ├── db/                 # Supabase client (re-export from lib)
│   ├── services/           # Domain services (auth, customer, payment, invoice, document, admin, stripe)
│   └── types.ts            # Server-side domain types (DB row shapes)
├── components/             # UI only – presentational and layout components
│   ├── ui/                 # Primitives (Button, Card, Input, etc.)
│   ├── layout/             # Header, Footer, sidebars
│   └── forms/              # Form pieces (TermsModal, FileUpload)
├── lib/                    # Shared utilities and client-safe code
│   ├── api-client.ts       # Typed fetch wrapper for calling our API (use in Client Components)
│   ├── supabase/           # Browser + server Supabase client config
│   ├── stripe/             # plans.ts (client-safe), config.ts (server-only)
│   ├── utils.ts            # formatCurrency, formatDate, etc.
│   └── validations.ts      # Zod schemas
├── types/                  # Shared types
│   ├── api.ts              # API request/response shapes
│   ├── supabase.ts         # Generated DB types
│   └── index.ts            # App-level types
├── constants/              # Routes, API paths, shared literals
└── middleware.ts           # Auth session refresh, route protection
```

## Data Flow

- **Server Components (portal, admin, home)**  
  Call `server/services/*` directly (same process). No HTTP.

- **Client Components (register, login, etc.)**  
  Use `lib/api-client` to call `app/api/*` over HTTP when they need to mutate or fetch from the backend.

- **API routes**  
  Validate input, call `server/services/*`, return JSON. No Supabase or Stripe calls in the route file.

## Backend (server/)

- **services/**  
  One module per domain: auth, customer, document, invoice, payment, admin (aggregates), stripe.  
  They use `server/db/supabase` to get Supabase clients and perform all DB and Stripe calls.

- **types.ts**  
  Re-exports DB row/insert types from `types/supabase` for use in server code.

## Frontend

- **Pages**  
  Compose UI and pass data. Data comes from either:
  - Server Components: await service calls.
  - Client Components: fetch via `api` from `lib/api-client`.

- **Components**  
  Presentational only. Receive data and callbacks via props.

## Adding a Feature

1. **New domain logic** → Add or extend a module under `server/services/`.
2. **New API** → Add route under `app/api/`, handler calls service(s).
3. **New page** → Under `app/`; use services (server) or `api` (client).
4. **New types** → `types/api.ts` for API contract, `types/supabase.ts` if DB changes.

## Security

- Auth: Supabase Auth; session refreshed in middleware.
- Protected routes: `/portal`, `/admin` require a logged-in user (middleware + layout checks).
- API routes: use `getCurrentUser()` and return 401 when unauthenticated.
- Admin: TODO – add role check and enforce in admin layout and API routes.
