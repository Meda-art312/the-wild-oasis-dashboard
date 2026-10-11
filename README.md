# The Wild Oasis Dashboard

A hotel management dashboard built with React, Vite, and Supabase. Staff can track reservations, manage cabins, check guests in and out, and review occupancy and sales.

This is a personal learning project. App access is restricted to trusted staff: every signed-in account can manage hotel records.

## Features

- Email/password login, protected pages, account details, and avatar uploads.
- Dashboard with sales, occupancy, stay-duration charts, and date-range filters.
- Booking search through status filters, sorting, pagination, and reservation details.
- Guest check-in and checkout, including breakfast charges and payment confirmation.
- Cabin creation, editing, duplication, photos, prices, and discounts.
- Hotel settings and a persistent light/dark theme.
- Development-only sample data loader that preserves existing records.

## Tech stack

React 18, React Router, TanStack Query, styled-components, React Hook Form, Recharts, and date-fns. Supabase provides email/password authentication, PostgreSQL with row-level security, and image storage. Vite builds the frontend; ESLint and Vitest provide code checks.

## Project structure

```text
src/features/     Authentication, bookings, cabins, check-in, dashboard, settings
src/services/     Supabase client and data access
src/ui/           Shared interface components
src/data/         Sample records and development loader
src/utils/        Shared helpers and regression tests
supabase/         Database and storage setup SQL
docs/             Verification report
vercel.json       SPA routing for Vercel
```

## Local setup

Use Node.js 22.12 or later (Node 24 is also supported).

```sh
npm ci
```

Copy `.env.example` to `.env.local`, then set:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

The key can be a modern `sb_publishable_...` key or a legacy `anon` key. These browser keys are public by design; database policies provide the access control. Never put a database password, secret API key, or service-role key in a `VITE_` variable. `.env.local` is ignored by Git.

```sh
npm run dev
```

Open the local URL printed by Vite. Restart Vite after changing environment variables. Missing configuration shows a setup message.

## Supabase setup

The current project is `the-wild-oasis` (`cgiotusznqkvpomhkkiz`), on the Free plan. Its schema and storage setup are already applied, public signup is disabled, and sample records are loaded. For this existing project, use its URL and publishable key; you do not need to run the SQL again.

For a different **new, empty** Supabase project:

1. Create a Free project with the Data API enabled. Save its database password privately; it is separate from the app-user password and is not needed by the browser app.
2. In Authentication → Sign In / Providers, disable **Allow new users to sign up** and leave anonymous sign-ins disabled. Keep email/password login enabled.
3. Run `supabase/setup.sql` once in SQL Editor. It creates `cabins`, `guests`, `bookings`, the singleton `settings` row, and the `cabin-images` and `avatars` buckets. The script is for a new database; do not rerun it on an initialized project.
4. In Authentication → Users → Add user → Create new user, create your app login and auto-confirm it. Enter the password yourself. This is a separate account from your Supabase dashboard login.
5. Set the project URL and publishable key in `.env.local`, restart Vite, and sign in to the app.

All four tables have row-level security. Anonymous users have no table privileges. Authenticated accounts can manage hotel records; settings cannot be inserted or deleted through the app. Both image buckets are public, limited to common raster image types and 5 MB per file. Use only images you are comfortable making public.

The Users screen opens Supabase user management. Public browser signup cannot safely provision staff for this app, so create additional trusted accounts in the Supabase dashboard. Do not enable public signup with these staff-wide policies.

## Sample data

After signing in locally, use **Load sample data** in the sidebar. It uploads the bundled cabin photos and inserts sample cabins, guests, and bookings with dates relative to today. It accepts empty tables or an unchanged partial sample upload, and refuses to overwrite existing records. It is available only in development and is excluded from the production UI.

Seeding spans multiple API requests. If a request fails after the sample cabins or guests are inserted, the loader can resume when those rows still match the bundled samples exactly and there are no bookings yet. Other existing data is left untouched. The loader never deletes records.


```

See [the verification report](docs/deployment-check.md) for tested behavior and remaining checks. The build currently produces a large JavaScript chunk; this is a performance warning, not a build failure. The layout is primarily intended for desktop staff use. Password recovery, reservation creation, and a separate guest-management screen are not implemented.
