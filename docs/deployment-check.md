# Deployment check — 2026-10-11

## Verified against the new Supabase backend

- Created a Free Supabase organization and the `the-wild-oasis` project (`cgiotusznqkvpomhkkiz`). The owner handled database and app-user password creation.
- Applied `supabase/setup.sql` successfully and connected the app through ignored `.env.local` configuration.
- Auth API returns HTTP 200 and reports `disable_signup: true`.
- Anonymous REST requests to cabins, guests, bookings, and settings all return HTTP 401.
- Login as `admin@example.com`, logout, rejection of an incorrect password, and protected-route redirects work.
- Empty dashboard renders with zero occupancy; populated dashboard and 7/90-day filters work.
- Uploaded all eight bundled cabin photos, sample guests, and 24 bookings. All eight cabin images loaded successfully from Supabase Storage.
- Cabin discount filtering, name sorting, duplication, and editing work. An edit with regular price 100 and discount 20 persisted correctly.
- Booking pagination, status filtering, amount sorting, detail pages, check-in, and checkout work. Booking #13 was checked in, then checked out, and the paid state persisted.
- Breakfast price was changed from 15 to 16, verified after reload, then restored to 15.
- Account display name was updated to Admin; the bundled default image was successfully uploaded to the avatars bucket and attached to the user.
- Theme changes persist after reload. The Users page links to owner-only Supabase account provisioning.
- The built production app was served locally, login tested, and `/bookings/13` successfully refreshed directly. Development sample tools were absent, and its browser console had no warnings or errors.

## Build checks

- ESLint passes with zero warnings.
- Five regression tests pass: three cabin-upload failure/duplication cases and two booking-date cases, including Cairo's daylight-saving change.
- Production build passes on Vite 7.3.7 and React Router 7.
- Dependency installation audit reports zero known vulnerabilities.
- `git diff --check` passes.

## Fixes and deployment preparation

- Replaced the dead hardcoded Supabase project/key with environment configuration, a setup screen, `.env.example`, and environment-file ignores.
- Added a new-project SQL schema with foreign keys, validation, RLS, storage policies, and default settings.
- Added Vercel SPA routing and deployment instructions in README.
- Replaced destructive data-reset buttons with a development-only sample loader that uploads images, preserves existing data, and resumes unchanged partial sample uploads.
- Fixed booking-night arithmetic across daylight-saving changes. The original helper counted a 23-hour interval as zero nights; calendar-day arithmetic now counts the stay correctly.
- Fixed settings updates to request the changed row before `.single()`.
- Fixed cabin name sorting, cache mutation during sorting, empty-state labeling, numeric discount validation, and missing-photo validation feedback.
- Fixed a cabin-edit failure path that previously deleted the cabin when its replacement photo upload failed.
- Added query-error rendering on dashboard, cabin list, booking list/detail/check-in, and settings. Fixed booking-table loading order and occupancy with zero cabins.
- Distinguished login connection failures from incorrect passwords, removed user-object logging, corrected flag labels, and labeled key icon buttons.
- Changed Users to owner-managed account provisioning because public staff signup is disabled.
- Updated vulnerable dependencies, removed obsolete duplicate ESLint configuration, and fixed existing lint errors.

## Remaining limitations and deployment steps

- No public hosting deployment has been created. Import the repository into Vercel, set the two `VITE_SUPABASE_*` variables, build with `npm run build`, and publish `dist`. After deployment, configure Supabase's final Site URL and any email redirect allowlist, then verify the live site.
- The frontend bundle is about 1.05 MB minified (303 KB gzip); Vite reports a non-blocking size warning. Code splitting is a future performance improvement.
- The layout is primarily intended for desktop use; a full mobile layout audit was not performed.
- There is no password-recovery UI, reservation-creation screen, or guest-management screen. Additional staff accounts are created in the Supabase dashboard. Email-based invitations/recovery require appropriate SMTP configuration.
- Destructive record deletion and password changes were not exercised. Deleting cabins referenced by bookings is intentionally rejected by the database foreign key. Uploaded files are not automatically garbage-collected after cabin/avatar changes.
- The database retains one extra test record named `QA cabin` (id 9), with price 100 and discount 20, and booking #13 remains checked out. Other sample bookings remain available for testing.
- The sample loader refuses another import once bookings exist or existing rows differ from the bundled samples.
- Supabase Free can pause after seven days of low activity. Resume the project in its dashboard if the backend becomes unavailable.

Official hosting and service references are linked in README. The old project cannot be recovered through this repository.
