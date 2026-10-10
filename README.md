# ServicePro FSMS — Frontend

Next.js (App Router) frontend for the [ServicePro FSMS API](https://github.com/Sumayea104/servicepro-fsms): customers request services, admins review and dispatch, technicians do the work, and payment is taken by Stripe or bKash.

**Stack:** Next.js 15 · React 19 · TypeScript (strict, no `any`) · Tailwind CSS + Radix primitives (shadcn-style components) · TanStack Query · Zustand · React Hook Form + Zod · Stripe Elements · Recharts · Sonner · Lucide.

## Demo logins (one-click buttons on `/login`)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@servicepro.com` | `Admin123!` |
| Customer | `demo.customer@servicepro.com` | `Customer123!` |
| Technician | `demo.technician@servicepro.com` | `Technician123!` |

These accounts are created by the backend seed (`npx prisma db seed`) — run it against the API you point this app at.

## Run locally

```bash
npm install
cp .env.example .env.local     # set NEXT_PUBLIC_API_URL to your running API (…/api/v1)
npm run dev                    # http://localhost:3000
npm run build && npm start     # production build
```

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | API base URL including `/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | This site's public URL (metadata / Open Graph) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe **test** publishable key |

## Deploy to Vercel

1. Push this repo to GitHub, then **Vercel → Add New → Project → import it** (framework auto-detected as Next.js).
2. Add the three environment variables above (Production + Preview). `NEXT_PUBLIC_API_URL` is your deployed API, e.g. `https://servicepro-fsms-ws.onrender.com/api/v1`.
3. Deploy. Then **on the API** set `FRONTEND_URL` to the Vercel URL (CORS and the bKash redirect use it) and redeploy the API.
4. In Stripe (test mode) point the webhook at `https://<api-domain>/api/v1/payments/webhook`; for bKash set `BKASH_CALLBACK_URL` to `https://<api-domain>/api/v1/payments/bkash/callback`.

## Architecture notes

- **Server Components by default.** Every dashboard page fetches on the server (`lib/server-api.ts`) with the user's token and renders HTML; `"use client"` is used only for forms, dialogs, charts, the notification bell and other interactive pieces. Each data page has a `loading.tsx` skeleton and each area an `error.tsx` boundary.
- **Auth & route protection.** Login stores the API's access/refresh tokens in cookies. `middleware.ts` (a) redirects visitors without a session to `/login?next=…`, (b) sends a logged-in user who opens another role's area back to their own dashboard, and (c) **rotates an expired access token** with the refresh token before Server Components render. Each role layout re-checks the role server-side, and the sidebar is chosen from the server-verified user, so UI and routes both honour the three roles. Real authorization is enforced by the API on every call.
- **URL state.** Search, filters, sorting and pagination all live in the query string (`hooks/use-url-state.ts`), so any view is bookmarkable and shareable.
- **State management.** TanStack Query for client-side server state (notifications with optimistic mark-read, technician suggestions, payment polling, all mutations); Zustand only for the signed-in user.
- **Forms.** React Hook Form + Zod everywhere; schemas in `lib/validators.ts` mirror the API's rules and server field errors are mapped back onto fields. The create-request flow is a 3-step wizard.
- **Uploads.** Avatar and job attachments go through the API to Cloudinary, with preview and a real progress bar (XHR upload progress).
- **Payments.** `Pay now` → `POST /payments/initiate`. Card: Stripe `PaymentElement` confirms and redirects to `/payment/success`, which polls the API until the signed webhook marks the payment `PAID`. bKash: redirect to bKash checkout, and the API redirects back to `/payment/success` or `/payment/failed`. `/payment/cancel` is reached from the Cancel buttons. No cash or manual "mark as paid" path exists.

## Pages (26)

Public: `/`, `/about`, `/services`, `/faq`, `/contact` · Auth: `/login` (one-click demo), `/register` · Customer: `/dashboard`, `/dashboard/jobs/new`, `/dashboard/jobs/[id]`, `/dashboard/jobs/[id]/pay`, `/dashboard/payments`, `/dashboard/profile` · Technician: `/provider`, `/provider/jobs/[id]`, `/provider/earnings`, `/provider/profile` · Admin: `/admin`, `/admin/jobs`, `/admin/jobs/[id]`, `/admin/technicians`, `/admin/users`, `/admin/reports` · Payment: `/payment/success`, `/payment/cancel`, `/payment/failed` · plus `not-found.tsx` and `error.tsx`.

## Known limits

- The contact form has no API endpoint, so it opens the visitor's email client (`mailto:`) instead of pretending to send.
- Tokens live in JS-readable cookies so the browser can call the API cross-origin; an httpOnly-cookie BFF would be stricter but is out of scope here.
- Card payments are recorded in USD and bKash in BDT (the API stores the currency per payment); earnings are therefore totalled per currency.

## Suggested commit sequence (20+)

`chore: scaffold Next.js app with Tailwind` → `feat: add design tokens and UI primitives` → `feat: add typed API client with token refresh` → `feat: add auth cookies, zustand store and middleware` → `feat: add login with one-click demo buttons` → `feat: add register form` → `feat: add public landing pages` → `feat: add site header, footer and mobile nav` → `feat: add dashboard shell with role-based navigation` → `feat: add shared table, filters and pagination with URL state` → `feat: customer request list and stats` → `feat: add multi-step create-request wizard` → `feat: add job detail view and timeline` → `feat: add attachment upload with progress` → `feat: technician job actions and service report` → `feat: admin assignment dialog with suggestions` → `feat: add Stripe and bKash payment flow` → `feat: add payment result pages` → `feat: payments history and technician earnings` → `feat: admin analytics charts` → `feat: technician verification, users and audit logs` → `feat: profile and availability settings` → `feat: notification bell with optimistic updates` → `feat: add loading, error and not-found states` → `docs: add README and env example`.
