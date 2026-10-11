# ServicePro FSMS Web - Field Service Management Frontend

ServicePro FSMS Web is the **Next.js frontend** for the ServicePro Field Service Management System. It gives each of the three roles (**Customer**, **Technician**, **Admin**) a role-specific dashboard on top of the [ServicePro FSMS API](https://github.com/Sumayea104/servicepro-fsms): customers request repairs, admins review and dispatch them with conflict-free scheduling, technicians work the jobs, and customers pay online by **Stripe** or **bKash**.

---

## 📦 Submission Details

| Item                  | Value                                                         |
| --------------------- | ------------------------------------------------------------- |
| **Frontend Repo**     | <https://github.com/Sumayea104/servicepro-fsms-web>           |
| **Live Frontend**     | `https://<your-frontend>.vercel.app`                          |
| **Backend Repo**      | <https://github.com/Sumayea104/servicepro-fsms>               |
| **Live API**          | `https://<your-service>.onrender.com/api/v1`                  |
| **Demo Video**        | `<paste your video link here>`                                |

### 🔐 One-click demo login

The login page has a **Quick Demo Login** button for each role - no typing needed.

| Role           | Email                            | Password         | Lands on     |
| -------------- | -------------------------------- | ---------------- | ------------ |
| **Admin**      | `admin@servicepro.com`           | `Admin123!`      | `/admin`     |
| **Customer**   | `demo.customer@servicepro.com`   | `Customer123!`   | `/dashboard` |
| **Technician** | `demo.technician@servicepro.com` | `Technician123!` | `/provider`  |

> ⚠️ These accounts are created by the backend seed script (`npx prisma db seed`). Credentials are for testing and demonstration only.

---

## 🚀 Tech Stack

| Category            | Technology                                                       |
| ------------------- | ---------------------------------------------------------------- |
| **Framework**       | Next.js 15 (App Router) + React 19                               |
| **Language**        | TypeScript (strict mode, no `any`)                               |
| **Styling / UI**    | Tailwind CSS 3, Radix UI primitives (shadcn-style components), Lucide icons, `next-themes` (light/dark) |
| **Typography**      | Inter (self-hosted via `next/font/local`)                        |
| **Imagery**         | Custom SVG illustrations in `public/images`, served with `next/image` |
| **Server state**    | TanStack Query 5                                                 |
| **Client state**    | Zustand                                                          |
| **Forms**           | React Hook Form + Zod                                            |
| **Payments**        | Stripe Elements (`@stripe/react-stripe-js`) + bKash redirect     |
| **Charts**          | Recharts                                                         |
| **Notifications**   | Sonner (toasts)                                                  |
| **Auth**            | JWT access/refresh tokens in cookies + Next.js Middleware        |
| **Deployment**      | Vercel                                                           |

---

## ✨ Features by Role

### 👤 Customer
- Register / log in, update profile and avatar (Cloudinary upload with preview and progress)
- **3-step wizard** to create a service request (basics → details → review)
- Track every request with filters, sorting and pagination, plus a full **status timeline**
- Upload photos / documents to a job, cancel a request before work starts
- **Pay online** with Stripe (card) or bKash, view payment history
- **Rate the technician** (overall, punctuality, professionalism, quality) after completion

### 🛠️ Technician
- Job list scoped to jobs assigned to them, with stats
- Accept → start → complete jobs (final cost entered on completion), cancel with a reason
- File a **service report** (summary, findings, labour hours, parts used) and upload work photos
- **Earnings** dashboard with monthly chart, totalled per currency
- Manage skills, service areas, availability toggle, current location and **weekly schedule**

### 👑 Admin
- **Analytics overview** with charts (jobs by status, users by role) and key numbers
- Review requests, **assign a technician from ranked suggestions** (distance, workload, rating) with a visit time - overlapping bookings are rejected by the API
- Reschedule, reject or cancel jobs; full-text search across all jobs
- Verify or reject technician applications
- Manage users (change role, deactivate) and browse the **audit log**

### ✨ Experience & design
- Elegant navy-and-gold design system with **light and dark mode** (follows the OS, toggle in the header)
- **Ctrl/⌘ + K command palette** in every dashboard: jump to any page, switch theme, search jobs (admin) or log out
- **Public technician directory** (`/technicians`) with skill and availability filters, plus profile pages with live ratings and reviews
- Visual **job progress stepper**, “Open in Maps” on addresses, **printable payment receipts**
- Customer **current-request tracker**, technician **upcoming-schedule agenda**, admin **attention cards, 14-day trend, activity feed and revenue per currency**
- Illustrated landing page, service cards, empty states and 404 page; password strength meter and show/hide on sign-up

### 🔔 Everyone
- Notification bell with unread count and **optimistic** mark-as-read
- Role-based navigation, responsive layout (mobile drawer, desktop sidebar), skeleton loaders, empty states and error boundaries

---

## 🗺️ Pages (29 + 404 + error boundary)

| Area | Route | Description |
| ---- | ----- | ----------- |
| **Public** | `/` | Landing page |
| | `/about` · `/services` · `/faq` · `/contact` | Company, service categories, FAQ, contact form |
| | `/technicians` · `/technicians/[id]` | Verified technician directory and public profile with reviews |
| **Auth** | `/login` | Email login + **one-click demo login** for all 3 roles |
| | `/register` | Sign up as Customer or Technician |
| **Customer** | `/dashboard` | My requests (stats, filters, pagination) |
| | `/dashboard/jobs/new` | Multi-step create-request wizard |
| | `/dashboard/jobs/[id]` | Job details, timeline, attachments, cancel, review |
| | `/dashboard/jobs/[id]/pay` | Stripe / bKash checkout |
| | `/dashboard/payments` · `/dashboard/payments/[id]` | Payment history and printable receipt |
| | `/dashboard/profile` | Profile and avatar |
| **Technician** | `/provider` | My assigned jobs |
| | `/provider/jobs/[id]` | Job actions, service report, work photos |
| | `/provider/earnings` | Earnings chart and payment list |
| | `/provider/profile` | Profile, skills, availability, weekly schedule |
| **Admin** | `/admin` | Analytics overview |
| | `/admin/jobs` · `/admin/jobs/[id]` | All jobs with search; review, assign, reschedule |
| | `/admin/technicians` | Pending verification / all technicians |
| | `/admin/users` | User management |
| | `/admin/reports` | Audit logs |
| **Payment** | `/payment/success` · `/payment/cancel` · `/payment/failed` | Payment result pages |
| **Utility** | `not-found.tsx` · `error.tsx` | Custom 404 and global error boundary |

---

## 📂 Project Structure

```
servicepro-fsms-web/
├── src/
│   ├── app/
│   │   ├── (public)/            # home, about, services, faq, contact, technicians
│   │   ├── (auth)/              # login, register
│   │   ├── dashboard/           # customer area  (layout + pages + loading/error)
│   │   ├── provider/            # technician area
│   │   ├── admin/               # admin area
│   │   ├── payment/             # success, cancel, failed
│   │   ├── layout.tsx           # root layout + metadata
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/                  # button, input, card, dialog, switch, skeleton…
│   │   ├── technicians/         # technician card, availability filter
│   │   ├── shared/              # DataTable, StatCard, StatusBadge, SearchInput, Pagination, EmptyState…
│   │   ├── layout/              # site header/footer, dashboard shell, notification bell
│   │   ├── forms/               # login, register, contact, job wizard
│   │   ├── jobs/                # job table/filters/detail + role action panels
│   │   ├── payments/            # payment panel, result, table
│   │   ├── profile/             # profile form, technician settings
│   │   ├── admin/               # verify / user actions
│   │   └── charts/              # Recharts wrappers
│   ├── hooks/                   # use-auth, use-url-state, use-debounce, use-job-action
│   ├── lib/                     # api-client, server-api, auth-cookies, jwt, validators, constants…
│   ├── store/auth-store.ts      # Zustand store
│   ├── types/api.ts             # typed API contracts
│   └── middleware.ts            # route protection + token rotation
├── public/images/               # custom SVG illustrations (hero, services, auth, empty, 404)
├── .env.example
└── package.json
```

---

## 🧱 Architecture & Key Decisions

- **Server Components by default.** Dashboard pages fetch on the server (`lib/server-api.ts`) with the user's token and render HTML; `"use client"` is used only where interaction is needed (forms, dialogs, charts, notification bell). Every data page has a `loading.tsx` skeleton and every area has an `error.tsx` boundary.
- **Authentication & route protection.** After login the API's access and refresh tokens are kept in cookies. `middleware.ts` redirects visitors without a session to `/login?next=…`, sends a user who opens another role's area back to their own dashboard, and **rotates an expired access token** with the refresh token *before* Server Components render. Each role layout re-checks the role server-side and the sidebar is chosen from the server-verified user, so both routes and UI follow the three roles. The API remains the real authority and enforces authorization on every request.
- **URL state.** Search, filters, sorting and pagination live in the query string via `useSearchParams` (`hooks/use-url-state.ts`), so any view can be bookmarked or shared.
- **State management.** TanStack Query handles client-side server state (notifications with optimistic updates, technician suggestions, payment polling, all mutations); Zustand holds only the signed-in user.
- **Forms.** React Hook Form + Zod everywhere; schemas mirror the API's rules and server-side field errors are mapped back onto the matching inputs.
- **File uploads.** Avatar and job attachments go through the API to Cloudinary with a preview and a real progress bar (XHR upload progress).
- **Typed end to end.** API responses, props and form data have explicit TypeScript types (`types/api.ts`).

### 💳 Payment flow

1. Customer clicks **Pay now** on a completed job → `POST /payments/initiate`.
2. **Card (Stripe):** the BDT job price is converted to USD by the API and shown before confirming; Stripe `PaymentElement` confirms the payment and redirects to `/payment/success`, which polls the API until the **signed webhook** marks the payment `PAID`.
3. **bKash:** the customer is redirected to bKash checkout; the API finalises the payment on callback and redirects back to `/payment/success` or `/payment/failed`.
4. **Cancel** buttons lead to `/payment/cancel`. There is no cash or manual "mark as paid" path.

---

## ⚙️ Getting Started

### Prerequisites
Node.js 20+ and a running (or deployed) [ServicePro FSMS API](https://github.com/Sumayea104/servicepro-fsms) that has been seeded.

### Installation

```bash
git clone https://github.com/Sumayea104/servicepro-fsms-web.git
cd servicepro-fsms-web
npm install
cp .env.example .env.local       # then set the values below
npm run dev                      # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_API_URL` | API base URL including `/api/v1` (e.g. `http://localhost:5000/api/v1`) |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this site (metadata / Open Graph) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe **test** publishable key (`pk_test_…`) |

### Scripts

| Script | Description |
| ------ | ----------- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build (type-checks and lints) |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

---

## 🌐 Deployment (Vercel)

1. Push this repository to GitHub, then in Vercel choose **Add New → Project** and import it (Next.js is auto-detected).
2. Add the three environment variables above for Production and Preview. `NEXT_PUBLIC_API_URL` must point at your deployed API.
3. Deploy.
4. On the **API**, set `FRONTEND_URL` to this site's Vercel URL (it controls CORS and the bKash redirect) and redeploy the API.
5. In Stripe (test mode) register `https://<api-domain>/api/v1/payments/webhook`, and set the API's `BKASH_CALLBACK_URL` to `https://<api-domain>/api/v1/payments/bkash/callback`.

---

## 💡 Challenges & Key Learnings

1. **Keeping sessions alive across domains.** The frontend and API live on different domains, so an API-set refresh cookie is never sent back. Tokens are returned in the response body and stored in frontend cookies; `middleware.ts` rotates expired access tokens before Server Components render, and the browser client uses a **single-flight refresh** so concurrent 401s share one call (the API rotates refresh tokens, so a second parallel refresh would otherwise log the user out).
2. **Role-based access in two layers.** Middleware gives fast redirects, each role layout re-verifies the role on the server, and the API enforces permissions - the UI never trusts anything a client can edit.
3. **Shareable list views.** Moving filters, search and pagination into the URL meant pages could stay Server Components that re-render from `searchParams`, instead of duplicating state on the client.
4. **Payments that don't trust the browser.** Stripe's redirect only says the user came back; the success page polls the API until the signed webhook has settled the payment, so the UI never shows "paid" on the client's word alone.
5. **Honest forms.** The contact form has no API endpoint, so it opens the visitor's email client rather than pretending to send.

### Known limitations
- Tokens are stored in JavaScript-readable cookies so the browser can call the API cross-origin. An httpOnly-cookie backend-for-frontend would be stricter.
- Card payments are recorded in USD and bKash in BDT, so earnings are totalled per currency.
- Illustrations are original SVG artwork; drop real photos into `public/images` and swap the `next/image` sources to use them.
- Google sign-in is available on the API (`POST /auth/google`) but has no button in this UI.

---

## 👨‍💻 Developer

- **Sumayea Rahman**
- **GitHub:** [Sumayea104](https://github.com/Sumayea104)
- **Email:** <sumayearahman7@gmail.com>

---

## 📞 Support

For questions or issues, please [open an issue](https://github.com/Sumayea104/servicepro-fsms-web/issues) or contact the developer.

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!
